import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MongoService } from 'src/mongo/mongo.service';
import { dailyCheckinGem, IUser, IUserGallery } from 'src/types/user.types';
import { UpdateUserDto } from './dto/updateUser.dto';
import { S3Service } from 'src/s3/s3.service';
import { getNowUnix } from 'src/utils';

@Injectable()
export class UsersService {
  private usersCollection: Collection<IUser>;
  private userGalleryCol: Collection<IUserGallery>;

  constructor(
    private mongoService: MongoService,
    private s3Service: S3Service,
  ) {
    this.usersCollection = mongoService.db.collection('users');
    this.userGalleryCol = mongoService.db.collection('userGallery');
  }

  async getUserByUsernameOrWallet(username: string): Promise<IUser> {
    return await this.usersCollection.findOne({
      $or: [{ username: username }, { walletAddress: username }],
    });
  }

  async update(
    user: IUser,
    data: UpdateUserDto,
    image?: Express.Multer.File,
  ): Promise<IUser> {
    let { name = '', email = '', username = '', interests = [] } = data;
    username = username.toLowerCase();
    email = email.toLowerCase();

    if (email) {
      // validate email
      const existingEmail = await this.usersCollection.findOne({
        _id: { $ne: user._id },
        email,
      });
      if (existingEmail) {
        throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
      }
    }
    if (username) {
      if (username.includes(' ')) {
        throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
      }

      const existingUsername = await this.usersCollection.findOne({
        _id: { $ne: user._id },
        username,
      });
      if (existingUsername) {
        throw new HttpException('Username already taken', HttpStatus.FORBIDDEN);
      }
    }

    let profileImage = user.profileImage;
    if (image) {
      profileImage = await this.s3Service.uploadFile({
        folder: 'users',
        file: image,
        fileName: username || user.username || user._id.toString(),
      });
    }
    const updateUserData: Partial<IUser> = {
      name,
      email,
      username,
      interests,
      profileImage,
    };

    await this.usersCollection.updateOne(
      { _id: user._id },
      { $set: updateUserData },
    );

    return { ...user, ...updateUserData };
  }

  async getMyGallery(user: IUser) {
    return await this.userGalleryCol.find({ userId: user._id }).toArray();
  }

  async topThreeUsers() {
    return await this.usersCollection
      .find({})
      .sort({ xp: -1 })
      .limit(3)
      .toArray();
  }

  async leaderBoard(page: number = 0, limit: number = 10) {
    if (limit > 100) limit = 100;

    const results = await this.usersCollection
      .aggregate([
        { $match: { xp: { $gt: 0 } } },
        { $sort: { xp: -1 } },
        {
          $facet: {
            count: [{ $count: 'total' }],
            rows: [{ $skip: page * limit }, { $limit: limit }],
          },
        },
      ])
      .toArray();

    return {
      rows: results[0].rows,
      page,
      total: results[0].count[0]?.total || 0,
    };
  }

  async dailyCheckin(user: IUser) {
    const now = getNowUnix();
    if (now - Number(user.lastCheckin) < 24 * 60 * 60) {
      throw new HttpException(
        'You already checked in today',
        HttpStatus.FORBIDDEN,
      );
    }

    const updateData: Partial<IUser> = {
      gem: user.gem + dailyCheckinGem,
      gemEarned: user.gemEarned + dailyCheckinGem,
      lastCheckin: now,
    };

    await this.usersCollection.updateOne(
      { _id: user._id },
      {
        $set: updateData,
      },
    );

    return { ...user, ...updateData };
  }
}
