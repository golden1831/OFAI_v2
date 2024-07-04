import { ObjectId } from 'mongodb';
import { ICompanion } from './companion.types';

export const profileLvlUpGEM = 50; // when profile level up, user gets 50 GEM for free
export const GEMCost = 0.01; // 100 GEM costs $1

export const freeMsgPerDay = 20;
export const userOnboardingGEM = 500; // when sign up, user gets 300 GEM for free
export const dailyCheckinGem = 10; // get free 10 GEM daily checkin

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

export const getProfileLvl = (currentXP: number) => {
  let currentLvl = 1;

  // Iterate through the level map
  for (const [lvl, xp] of Object.entries(profileLvlXpMap)) {
    if (currentXP < xp) {
      return currentLvl;
    }
    currentLvl = parseInt(lvl);
  }

  return currentLvl;
};

export const calcUserLvlUpGEM = (prevXP: number, xp: number) => {
  const prevLvl = getProfileLvl(prevXP);
  const currentLvl = getProfileLvl(xp);
  return currentLvl > prevLvl ? profileLvlUpGEM : 0;
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
  _id: ObjectId;
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
  interests?: string[];
  plan: {
    type: PlanType;
    startDate: number; // unix timestamp
  };
  currentFreeMessages: number;
  lastMessageUpdate?: number; // unix timestamp
  isAdmin: boolean;
  isActive: boolean;
}

export enum GalleryType {
  picture = 'picture',
  video = 'video',
}
export interface IUserGallery {
  _id: ObjectId;
  userId: ObjectId;
  companionId: ObjectId;
  companion?: ICompanion;
  url: string;
  type: GalleryType;
}
