import { getBucket } from '@extend-chrome/storage';

export interface UserInformation {
  name: string;
  email: string;
  password: string;
  company: string;
  position: string;
}

export interface MailOption {
  sendtext: string;
  returntext: string;
  apikey: string;
  model: string;
  freeTier: number;
  language: string;
}

export interface MyBucket {
  user: UserInformation;
  mail: MailOption;
  updated: Date;
  is_installed: boolean;
}

export const bucket = getBucket<MyBucket>('my_bucket', 'sync');
