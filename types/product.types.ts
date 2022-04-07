import { Schema } from 'mongoose';

export interface IProduct {
  name: string;
  alias: string;
  description: string;
  logo: string;
  coverImage: string;
  website: string;
  id: string;
  createdBy: Schema.Types.ObjectId;
  upvotes: number;
  upvoted: boolean;
  toObject: () => any;
}
