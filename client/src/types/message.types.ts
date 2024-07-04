import { CompanionPictureTag, CompanionVideoTag, ICompanion } from './Companion.types';
import { IUser } from './user.types';

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

  for (const [lvl, xp] of Object.entries(roomLvlXPMap)) {
    if (currentXP < xp) return currentLvl;

    currentLvl = parseInt(lvl);
  }

  return currentLvl;
};

export const getRoomLevelXP = (currentXP: number) => {
  let data = {
    nextLvl: 0,
    currLvl: 0,
  };

  for (const [lvl, xp] of Object.entries(roomLvlXPMap)) {
    if (currentXP >= xp) {
      const currentLevel = roomLvlXPMap[Number(lvl) as keyof typeof roomLvlXPMap];
      const findNextLevel = roomLvlXPMap[Number(lvl) + 1 as keyof typeof roomLvlXPMap]

      if (!findNextLevel) {
        data = {
          nextLvl: currentLevel,
          currLvl: currentLevel,
        }
      }

      data = {
        nextLvl: findNextLevel,
        currLvl: currentLevel,
      }
    }
  }

  return data;
};

export interface IRoom {
  _id: string;
  userId: string;
  user?: IUser;
  companionId: object;
  companion?: ICompanion;
  messages?: IMessage[];
  xp: number;
  // lvl: number;
  subscribe?: boolean;
  subscribeStartDate?: number; //unix timestamp
}

export interface IMessage {
  _id: string;
  message: string;
  voicecontenturl?: string;
  image?: string;
  imageTag?: CompanionPictureTag;
  imageLock?: boolean;
  picId?: string;
  type: MessageType;
  userId: string;
  user?: IUser;
  videoUrl?: string;
  videoTag?: CompanionVideoTag;
  videoId?: string;
  videoLock?: boolean;
  companionId: string;
  companion?: ICompanion;
  role: RoleType;
  roomId: string;
  room?: IRoom;
  createdAt: number;
  updatedAt?: number;
  senderName?: string;
  senderImage?: string;
}
