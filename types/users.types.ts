import { Schema } from 'mongoose';

export interface IUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  ethAddress?: string;
  coverImage?: string;
  twitter?: string;
  website?: string;
  id: Schema.Types.ObjectId;
  checkPassword: (passwordToCheck: string) => Promise<boolean>;
}

export interface IUserProfile {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  ethAddress?: string;
  coverImage?: string;
  twitter?: string;
  website?: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User {
      username: string;
      id?: Schema.Types.ObjectId;
    }
  }
}
