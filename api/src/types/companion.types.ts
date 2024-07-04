import { ObjectId } from 'mongodb';

export enum CompanionPictureTag {
  General = 'General',
  Lingerie = 'Lingerie',
  WorkingOut = 'WorkingOut',
  Pool = 'Pool',
  Dress = 'Dress',
  Party = 'Party',
  Butt = 'Butt',
  Naked = 'Naked',
  Boobs = 'Boobs',
  Posing = 'Posing',
  Sexy = 'Sexy',
  Teasing = 'Teasing',
  Bikini = 'Bikini',
  NakedInBed = 'NakedInBed',
  WetTShirt = 'WetTShirt',
  BDSMLeash = 'BDSMLeash',
  PoolNaked = 'PoolNaked',
  BubbleBath = 'BubbleBath',
  CowgirlHat = 'CowgirlHat',
  Dildo = 'Dildo',
}

export enum CompanionTraitType {
  Dominant = 'Dominant',
  Submissive = 'Submissive',
  Kinky = 'Kinky',
  Mean = 'Mean',
  Caring = 'Caring',
  OpenMinded = 'Open-minded',
  Loyal = 'Loyal',
  Nerdy = 'Nerdy',
  Tease = 'Tease',
  Adventurous = 'Adventurous',
  Sensual = 'Sensual',
  Playful = 'Playful',
  Seductive = 'Seductive',
  Naughty = 'Naughty',
  Romantic = 'Romantic',
  Mischievous = 'Mischievous',
  Bold = 'Bold',
  Insatiable = 'Insatiable',
  Curious = 'Curious',
  Thrilling = 'Thrilling',
  Erotic = 'Erotic',
  Passionate = 'Passionate',
  Intense = 'Intense',
  Sultry = 'Sultry',
  Voyeuristic = 'Voyeuristic',
  Exhibitionist = 'Exhibitionist',
  Fetishist = 'Fetishist',
  Experimental = 'Experimental',
  Alluring = 'Alluring',
  Provocative = 'Provocative',
}

export interface ICompanionPic {
  _id: ObjectId;
  name: string;
  description?: string;
  tags: CompanionPictureTag[];
  url: string;
  companionId: ObjectId;
  aiReference?: boolean;
}

export interface ICompanion {
  _id: ObjectId;
  firstName: string;
  lastName?: string;
  username: string;
  country: string;
  age: string;
  shortBio: string;
  longBio: string;
  voiceSampleUrl?: string;
  voiceID?: string;
  prompt?: string;
  imageId?: ObjectId;
  image?: ICompanionPic;
  videoId?: ObjectId;
  video?: ICompanionVideo;
  totalMsg: number;
  isAiGirl: boolean;
  traits: CompanionTraitType[];
  deleted?: boolean;
}

export enum CompanionVideoTag {
  General = 'General',
  WithAGuy = 'WithAGuy',
  Cute = 'Cute',
  Dildo = 'Dildo',
}

export interface ICompanionVideo {
  _id: ObjectId;
  name: string;
  description?: string;
  tags: CompanionVideoTag[];
  url: string;
  companionId: ObjectId;
}
