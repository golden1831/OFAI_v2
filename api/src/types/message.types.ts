import { ObjectId } from 'mongodb';
import { IUser } from './user.types';
import {
  CompanionPictureTag,
  CompanionVideoTag,
  ICompanion,
} from './companion.types';

export enum MessageMode {
  text = 'text',
  audio = 'audio',
}

export enum RoleType {
  user = 'user',
  assistant = 'assistant',
}

export enum MessageType {
  message = 'message',
  picture = 'picture',
  audio = 'audio',
  video = 'video',
}

export const messageXP = 10; // whenever new message, user gets 10 XP
// export const audioXP = 20;
// export const pictureXP = 50;

export const audioCost = 20; // for audio response, user needs to spend 20 GEM
export const pictureRevealCost = 30; // for reveal pic, user needs to spend 200 GEM
export const videoCost = 200; // sending video requires 500 GEM

export const roomLvlUpGEM = 20; /// whenever level up on a girl, user gets 20 GEM for free

export const roomLvlXPMap = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2100,
  8: 2800,
  9: 3600,
  10: 5000,
};

export const getRoomLvl = (currentXP: number) => {
  let currentLvl = 1;

  // Iterate through the level map
  for (const [lvl, xp] of Object.entries(roomLvlXPMap)) {
    if (currentXP < xp) {
      return currentLvl;
    }
    currentLvl = parseInt(lvl);
  }

  return currentLvl;
};

export const calcRoomLvlUpGEM = (prevXP: number, xp: number) => {
  const prevLvl = getRoomLvl(prevXP);
  const currentLvl = getRoomLvl(xp);
  return currentLvl > prevLvl ? roomLvlUpGEM : 0;
};

export interface IRoom {
  _id: ObjectId;
  userId: ObjectId;
  user?: IUser;
  companionId: Object;
  companion?: ICompanion;
  messages?: IMessage[];
  xp: number;
  // lvl: number;
  subscribe?: boolean;
  subscribeStartDate?: number; //unix timestamp
}

export interface IMessage {
  _id: ObjectId;
  message: string;
  voicecontenturl?: string;
  image?: string;
  imageTag?: CompanionPictureTag;
  imageLock?: boolean;
  picId?: ObjectId;
  type: MessageType;
  userId: ObjectId;
  user?: IUser;
  videoUrl?: string;
  videoTag?: CompanionVideoTag;
  videoId?: ObjectId;
  videoLock?: boolean;
  companionId: ObjectId;
  companion?: ICompanion;
  role: RoleType;
  roomId: ObjectId;
  room?: IRoom;
  createdAt: number;
  updatedAt?: number;
}
