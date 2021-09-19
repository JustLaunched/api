import { Schema } from 'mongoose';

export interface IUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  coverImage?: string;
  twitter?: string;
  website?: string;
  checkPassword: (passwordToCheck: string) => Promise<boolean>;
}

declare global {
  namespace Express {
    interface User {
      username: string;
      id?: Schema.Types.ObjectId;
    }
  }
}
