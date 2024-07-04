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
  _id: string;
  name: string;
  description?: string;
  tags: CompanionPictureTag[];
  url: string;
  companionId: string;
}

export interface ICompanion {
  _id: string;
  firstName: string;
  lastName?: string;
  username: string;
  country: string;
  age: string;
  shortBio: string;
  longBio: string;
  voiceSampleUrl?: string;
  voiceID?: string;
  imageId: string;
  image: ICompanionPic;
  totalMsg: number;
  isAiGirl: boolean;
  traits: CompanionTraitType[];
}

export enum CompanionVideoTag {
  General = 'General',
  WithAGuy = 'WithAGuy',
  Cute = 'Cute',
  Dildo = 'Dildo',
}

export interface ICompanionVideo {
  _id: string;
  name: string;
  description?: string;
  tags: CompanionVideoTag[];
  url: string;
  companionId: string;
}
