export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  coverImage?: string;
  twitter?: string;
  website?: string;
}
