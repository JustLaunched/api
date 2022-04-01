import { Schema } from 'mongoose';

export interface IUser {
  address: string;
  email?: string;
  avatar?: string;
  about?: string;
  coverImage?: string;
  twitter?: string;
  nonce: number;
  website?: string;
  id: Schema.Types.ObjectId;
}

export interface IUserProfile {
  email?: string;
  avatar?: string;
  about?: string;
  coverImage?: string;
  twitter?: string;
  website?: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User {
      address: string;
      id?: Schema.Types.ObjectId;
    }
  }
}
