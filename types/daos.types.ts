import { Schema } from 'mongoose';

export interface IDao {
  name: string;
  alias: string;
  description: string;
  logo: string;
  coverImage: string;
  website: string;
  id: string;
  createdBy: Schema.Types.ObjectId;
}
