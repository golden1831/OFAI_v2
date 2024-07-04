import { ICompanion } from './Companion.types';

export const profileLvlXpMap = {
  1: 0,
  2: 500,
  3: 1000,
  4: 2000,
  5: 4000,
  6: 6000,
  7: 8000,
  8: 10000,
  9: 15000,
  10: 21000,
};

export const dailyCheckinGem = 10; // get free 10 GEM daily checkin

export const getProfileLvl = (currentXP: number) => {
  let currentLvl = 1;

  for (const [lvl, xp] of Object.entries(profileLvlXpMap)) {
    if (currentXP < xp) return currentLvl;

    currentLvl = parseInt(lvl);
  }

  return currentLvl;
};

export const getProfileLevelXP = (currentXP: number) => {
  let data = {
    nextLvl: 0,
    currLvl: 0,
  };

  for (const [lvl, xp] of Object.entries(profileLvlXpMap)) {
    if (currentXP >= xp) {
      const currentLevel = profileLvlXpMap[Number(lvl) as keyof typeof profileLvlXpMap];
      const findNextLevel = profileLvlXpMap[(Number(lvl) + 1) as keyof typeof profileLvlXpMap];

      if (!findNextLevel) {
        data = {
          nextLvl: currentLevel,
          currLvl: currentLevel,
        };
      }

      data = {
        nextLvl: findNextLevel,
        currLvl: currentLevel,
      };
    }
  }

  return data;
};

export enum PlanType {
  free = 'free',
  pro = 'pro',
}

export const plans = {
  [PlanType.free]: 0,
  [PlanType.pro]: 20, // $
};

export interface IUser {
  _id: string; // unique field - wallet or email
  walletAddress: string;
  name?: string;
  email?: string;
  profileImage?: string;
  type: 'wallet' | 'social';
  gem: number;
  gemEarned: number;
  lastCheckin?: number; // last checin date to get 10 GEM for free, unix timestamp
  xp: number;
  // lvl: number;
  username?: string;
  interests?: string;
  plan: {
    type: PlanType;
    startDate: number; // unix timestamp
  };
  currentFreeMessages: number;
  lastMessageUpdate?: number; // unix timestamp
}

export enum GalleryType {
  picture = 'picture',
  video = 'video',
}
export interface IUserGallery {
  _id: string;
  userId: string;
  companionId: string;
  companion?: ICompanion;
  url: string;
  type: GalleryType;
}
