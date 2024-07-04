import { Storage } from '@google-cloud/storage';
import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import axios from 'axios';
import { Collection, ObjectId, WithoutId } from 'mongodb';
import { CompanionsService } from 'src/companions/companions.service';
import { MongoService } from 'src/mongo/mongo.service';
import { PromptchanService } from 'src/promptchan/promptchan.service';
import { S3Service } from 'src/s3/s3.service';
import {
  CompanionPictureTag,
  CompanionVideoTag,
  ICompanion,
  ICompanionPic,
  ICompanionVideo,
} from 'src/types/companion.types';
import {
  audioCost,
  calcRoomLvlUpGEM,
  IMessage,
  IRoom,
  MessageMode,
  MessageType,
  messageXP,
  pictureRevealCost,
  RoleType,
  videoCost,
} from 'src/types/message.types';
import {
  calcUserLvlUpGEM,
  GalleryType,
  IUser,
  IUserGallery,
} from 'src/types/user.types';
import { removeStyleMessage } from 'src/utils';
import { getGPTResponse, regenGPTResponse } from 'src/utils/gpt';

@Injectable()
export class RoomsService {
  private readonly gCStorage;
  private usersCol: Collection<IUser>;
  private roomsCol: Collection<WithoutId<IRoom>>;
  private messagesCol: Collection<WithoutId<IMessage>>;
  private companionsCol: Collection<WithoutId<ICompanion>>;
  private companionPicsCol: Collection<WithoutId<ICompanionPic>>;
  private companionVideosCol: Collection<WithoutId<ICompanionVideo>>;
  private userGalleryCol: Collection<WithoutId<IUserGallery>>;

  constructor(
    private readonly mongoService: MongoService,
    private readonly companionsService: CompanionsService,
    private readonly s3Service: S3Service,
    private readonly promptchanService: PromptchanService,
  ) {
    this.gCStorage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    this.usersCol = mongoService.db.collection('users');
    this.companionsCol = mongoService.db.collection('companions');
    this.roomsCol = mongoService.db.collection('rooms');
    this.messagesCol = mongoService.db.collection('messages');
    this.companionPicsCol = mongoService.db.collection('companionPics');
    this.companionVideosCol = mongoService.db.collection('companionVideos');
    this.userGalleryCol = mongoService.db.collection('userGallery');
  }

  async sendMessage(
    user: IUser,
    companionId: string,
    message: string,
    mode?: string,
  ): Promise<IMessage> {
    const companion =
      await this.companionsService.getCompanionsById(companionId);
    if (!companion) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            companion: `Companion does not exist`,
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // validate daily free messages

    // validate GEM for audio mode
    if (mode === MessageMode.audio) {
      if (user.gem < audioCost) {
        throw new HttpException(
          "You don't have enough GEM",
          HttpStatus.FORBIDDEN,
        );
      }
    }

    let room = await this.roomsCol.findOne({
      userId: user._id,
      companionId: companion._id,
    });
    if (!room) {
      const roomData: WithoutId<IRoom> = {
        userId: user._id,
        companionId: companion._id,
        xp: 0,
      };
      const newRoom = await this.roomsCol.insertOne(roomData);
      room = {
        _id: newRoom.insertedId,
        ...roomData,
      };
    }

    // Fetch the last 6 messages in the chat
    const previousMessages = await this.messagesCol
      .find({ roomId: room._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const gptResponse = await getGPTResponse(
      previousMessages.reverse(),
      message,
      companion,
    );

    console.log('usermessage ===>', message);
    console.log(gptResponse);

    let audioUrl: string = '';
    let imageUrl: string = '';
    let imageTag: CompanionPictureTag | undefined = undefined;
    let type: MessageType = MessageType.message;
    let companionMessage: string = gptResponse;
    let imageLock = undefined;
    let picId = undefined;
    let videoUrl: string = '';
    let videoTag: CompanionVideoTag | undefined = undefined;
    let videoId = undefined;
    let videoLock = undefined;

    if (message === 'getSalutation') {
      if (companion.videoId) {
        const introVideo = await this.companionVideosCol.findOne({
          _id: companion.videoId,
        });
        if (introVideo) {
          type = MessageType.video;
          videoLock = false;
          videoUrl = introVideo.url;
        }
      }
    } else if (gptResponse.includes('@picture:')) {
      const parsedResponse = gptResponse.split('@picture:');
      companionMessage = parsedResponse[0];
      imageTag = parsedResponse[1]
        .split(' ')[0]
        .replaceAll('*', '') as CompanionPictureTag;
      console.log('imageTag ===>', imageTag);
    } else if (gptResponse.includes('@video:')) {
      const parsedResponse = gptResponse.split('@video:');
      companionMessage = parsedResponse[0];
      videoTag = parsedResponse[1]
        .split(' ')[0]
        .replaceAll('*', '') as CompanionVideoTag;
      console.log('videoTag ===>', videoTag);
    }

    if (message !== 'getSalutation') {
      await this.messagesCol.insertOne({
        message,
        type: MessageType.message,
        userId: user._id,
        companionId: companion._id,
        role: RoleType.user,
        roomId: room._id,
        createdAt: Number(new Date().getTime()),
      });
    }

    if (mode === MessageMode.audio) {
      // save message
      type = MessageType.audio;
      const cleanCompanionMessage = removeStyleMessage(companionMessage);
      audioUrl = await this.audioGenerator(companion, cleanCompanionMessage);
    }

    if (imageTag) {
      // const image = await this.getCompanionPictutre(companion, imageTag);
      const image = await this.generateCompanionPicture(
        companion,
        message,
        imageTag,
      );

      if (image) {
        type = MessageType.picture;
        // imageUrl = image.url;
        picId = image._id;
        imageLock = true;
      } else {
        imageTag = undefined;
        companionMessage = await regenGPTResponse(message, companion);
      }
    } else if (videoTag) {
      const video = await this.getCompanionVideo(companion, videoTag);

      if (video) {
        type = MessageType.video;
        // videoUrl = video.url;
        videoId = video._id;
        videoLock = true;
      } else {
        videoTag = undefined;
        companionMessage = await regenGPTResponse(message, companion, false);
      }
    }

    const messageData: WithoutId<IMessage> = {
      message: companionMessage,
      voicecontenturl: audioUrl,
      image: imageUrl,
      imageTag,
      imageLock,
      picId,
      type,
      videoTag,
      videoUrl,
      videoId,
      videoLock,
      userId: user._id,
      companionId: companion._id,
      role: RoleType.assistant,
      roomId: room._id,
      createdAt: Number(new Date().getTime()),
    };

    const newMessage = await this.messagesCol.insertOne(messageData);

    // update room XP and GEM
    const roomXP = room.xp + messageXP;
    const roomLvlUpGEM = calcRoomLvlUpGEM(room.xp, roomXP);
    await this.roomsCol.updateOne(
      { _id: room._id },
      {
        $set: {
          xp: roomXP,
        },
      },
    );

    // update user XP  and GEM
    const userXP = user.xp + messageXP;
    const userLvlUpGEM = calcUserLvlUpGEM(user.xp, userXP);
    await this.usersCol.updateOne(
      { _id: user._id },
      {
        $set: {
          xp: userXP,
          gem:
            user.gem +
            roomLvlUpGEM +
            userLvlUpGEM -
            (mode === MessageMode.audio ? audioCost : 0),
          gemEarned: user.gemEarned + roomLvlUpGEM + userLvlUpGEM,
        },
      },
    );

    // update girl totalMsg
    await this.companionsCol.updateOne(
      { _id: companion._id },
      { $inc: { totalMsg: 1 } },
    );

    return { ...messageData, _id: newMessage.insertedId };
  }

  async getMessageWhenSignOut(companionId: string) {
    const companion =
      await this.companionsService.getCompanionsById(companionId);
    if (!companion) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            companion: `Companion does not exist`,
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const gptResponse = await getGPTResponse([], 'getSalutation', companion);

    return {
      _id: '1',
      message: gptResponse,
      type: MessageType.message,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '',
      companionId: companion._id,
      role: RoleType.assistant,
      roomeId: '',
    };
  }

  async getCompanionPictutre(companion: ICompanion, tag: CompanionPictureTag) {
    try {
      // let taggedImageExists = true;
      let pics = [];
      if (!tag) {
        return null;
      } else if (tag === CompanionPictureTag.General) {
        pics = await this.companionPicsCol
          .find({
            companionId: companion._id,
            _id: { $ne: companion.imageId },
          })
          .toArray();
      } else {
        pics = await this.companionPicsCol
          .find({
            companionId: companion._id,
            _id: { $ne: companion.imageId },
            tags: tag,
          })
          .toArray();
      }
      // if (pics.length === 0) {
      //   taggedImageExists = false;
      //   pics = await this.companionPicsCol
      //     .find({
      //       companionId: companion._id,
      //       _id: { $ne: companion.imageId },
      //     })
      //     .toArray();
      // }
      if (pics.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * pics.length);

      return pics[randomIndex];
    } catch (error) {
      console.log('getCompanionPictutre error ===>', error);
      return null;
    }
  }

  async generateCompanionPicture(
    companion: ICompanion,
    message: string,
    tag: CompanionPictureTag,
  ): Promise<ICompanionPic> {
    try {
      let base64 = '';
      const pic = await this.companionPicsCol.findOne({
        companionId: companion._id,
        aiReference: true,
      });
      if (!pic) {
        base64 = await this.promptchanService.text2Img(message);
      } else {
        base64 = await this.promptchanService.img2Img(pic.url, message);
      }

      if (!base64) return null;

      const url = await this.s3Service.uploadBase64Image({
        folder: `companions/${companion.username}`,
        fileName: tag,
        base64,
        bucketName: 'ofaiv2',
      });

      console.log('uploaded image url ===>', url);

      const picData: WithoutId<ICompanionPic> = {
        name: `${companion.firstName} ${tag}`,
        tags: [tag],
        companionId: companion._id,
        url,
      };
      const newPic = await this.companionPicsCol.insertOne(picData);
      return { ...picData, _id: newPic.insertedId };
    } catch (error) {
      return null;
    }
  }

  async getCompanionVideo(companion: ICompanion, tag: CompanionVideoTag) {
    try {
      let videos = [];

      if (!tag) {
        return null;
      } else if (tag === CompanionVideoTag.General) {
        videos = await this.companionVideosCol
          .find({
            companionId: companion._id,
            _id: { $ne: companion.videoId },
          })
          .toArray();
      } else {
        videos = await this.companionVideosCol
          .find({
            companionId: companion._id,
            tags: tag,
            _id: { $ne: companion.videoId },
          })
          .toArray();
      }

      if (videos.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * videos.length);

      return videos[randomIndex];
    } catch (error) {
      console.log('getCompanionPictutre error ===>', error);
      return null;
    }
  }

  async audioGenerator(companion: ICompanion, message: string) {
    if (!message) {
      return '';
    }

    try {
      const url = `${process.env.ELEVENTLABSURL}${companion.voiceID}`;

      const response = await axios.post(
        url,
        {
          text: message,
          model_id: process.env.ELEVENTLABS_MODEL_ID,
          voice_settings: {
            stability: 0.6,
            similarity_boost: 1,
            style: 0,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            Accept: 'audio/mp3',
            'xi-api-key': process.env.ELEVENTLABS_XI_API_KEY, // Always use environment variables for secrets
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      );

      const key = `audios/${Date.now()}.mp3`;
      const bucket = this.gCStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
      const blob = bucket.file(key);

      await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({ resumable: false });
        blobStream.on('error', reject);
        blobStream.on('finish', resolve);
        blobStream.end(response.data);
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      return publicUrl;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR, // Consider using a more specific or accurate status code based on the error context
          errors: { message: `An error occurred while generating audio` },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessages(user: IUser, companionId: string) {
    const companion =
      await this.companionsService.getCompanionsById(companionId);
    if (!companion) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            companion: `Companion does not exist`,
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const messages = await this.messagesCol
      .find({
        userId: user._id,
        companionId: companion._id,
      })
      .toArray();

    return {
      messages,
      total: messages.length,
    };
  }

  async getMyRooms(user: IUser) {
    return await this.roomsCol
      .aggregate([
        { $match: { userId: user._id } },
        {
          $lookup: {
            from: 'companions',
            localField: 'companionId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'companionPics',
                  localField: 'imageId',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        url: 1,
                      },
                    },
                  ],
                  as: 'image',
                },
              },
              {
                $unwind: {
                  path: '$image',
                },
              },
            ],
            as: 'companion',
          },
        },
        {
          $unwind: {
            path: '$companion',
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: '_id',
            foreignField: 'roomId',
            pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
            as: 'messages',
          },
        },
      ])
      .toArray();
  }

  async streamMessagePic(messageId: string): Promise<StreamableFile> {
    const message = await this.messagesCol.findOne({
      _id: new ObjectId(messageId),
      type: MessageType.picture,
      imageLock: true,
    });
    if (!message || !message.picId) return null;

    const pic = await this.companionPicsCol.findOne({ _id: message.picId });
    if (!pic || !pic.url) return null;

    return this.s3Service.fetchAndBlurImage(
      'ofaiv2',
      pic.url.replace('https://storage.googleapis.com/ofaiv2/', ''),
    );
  }

  async unlockPic(user: IUser, messageId: string): Promise<IMessage> {
    if (user.gem < pictureRevealCost) {
      throw new HttpException(
        "You don't have enough GEM",
        HttpStatus.FORBIDDEN,
      );
    }
    const message = await this.messagesCol.findOne({
      _id: new ObjectId(messageId),
      type: MessageType.picture,
      imageLock: true,
    });
    if (!message || !message.picId) return null;

    const pic = await this.companionPicsCol.findOne({ _id: message.picId });
    if (!pic || !pic.url) return null;

    const updateData: Partial<IMessage> = {
      imageLock: false,
      image: pic.url,
      picId: undefined,
    };

    await this.messagesCol.updateOne(
      { _id: message._id },
      { $set: updateData },
    );

    await this.usersCol.updateOne(
      { _id: user._id },
      { $set: { gem: user.gem - pictureRevealCost } },
    );

    await this.userGalleryCol.updateOne(
      { userId: user._id, type: GalleryType.picture, url: pic.url },
      {
        $set: {
          userId: user._id,
          type: GalleryType.picture,
          url: pic.url,
          companionId: message.companionId,
        },
      },
      { upsert: true },
    );

    return { ...message, ...updateData };
  }

  async streamMessageVideo(messageId: string, range: string) {
    const message = await this.messagesCol.findOne({
      _id: new ObjectId(messageId),
      type: MessageType.video,
      videoLock: true,
    });
    if (!message || !message.videoId) return null;

    const video = await this.companionVideosCol.findOne({
      _id: message.videoId,
    });
    if (!video || !video.url) return null;

    return this.s3Service.streamAnBlurVideo(
      'ofaiv2',
      video.url.replace('https://storage.googleapis.com/ofaiv2/', ''),
      range,
    );
  }

  async unlockVideo(user: IUser, messageId: string): Promise<IMessage> {
    if (user.gem < videoCost) {
      throw new HttpException(
        "You don't have enough GEM",
        HttpStatus.FORBIDDEN,
      );
    }
    const message = await this.messagesCol.findOne({
      _id: new ObjectId(messageId),
      type: MessageType.video,
      videoLock: true,
    });
    if (!message || !message.videoId) return null;

    const video = await this.companionVideosCol.findOne({
      _id: message.videoId,
    });
    if (!video || !video.url) return null;

    const updateData: Partial<IMessage> = {
      videoLock: false,
      videoUrl: video.url,
      videoId: undefined,
    };

    await this.messagesCol.updateOne(
      { _id: message._id },
      { $set: updateData },
    );

    await this.usersCol.updateOne(
      { _id: user._id },
      { $set: { gem: user.gem - videoCost } },
    );

    await this.userGalleryCol.updateOne(
      { userId: user._id, type: GalleryType.video, url: video.url },
      {
        $set: {
          userId: user._id,
          type: GalleryType.video,
          url: video.url,
          companionId: message.companionId,
        },
      },
      { upsert: true },
    );

    return { ...message, ...updateData };
  }

  async deleteRoom(user: IUser, roomId: string) {
    const room = await this.roomsCol.findOne({
      _id: new ObjectId(roomId),
      userId: user._id,
    });
    if (!room) {
      throw new HttpException('Not found room', HttpStatus.NOT_FOUND);
    }

    await this.messagesCol.deleteMany({ roomId: room._id });
    await this.roomsCol.deleteOne({ _id: room._id });

    return;
  }

  async refreshRoom(user: IUser, roomId: string) {
    const room = await this.roomsCol.findOne({
      _id: new ObjectId(roomId),
      userId: user._id,
    });
    if (!room) {
      throw new HttpException('Not found room', HttpStatus.NOT_FOUND);
    }

    await this.messagesCol.deleteMany({ roomId: room._id });

    const companion = await this.companionsService.getCompanionsById(
      room.companionId.toString(),
    );

    return { ...room, companion, messages: [] };
  }
}
