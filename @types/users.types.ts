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
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User {
      username: string;
      id?: Schema.Types.ObjectId;
    }
  }
}
