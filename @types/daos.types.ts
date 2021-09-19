import { Schema } from 'mongoose';

export interface IDao {
  name: String;
  alias: String;
  description: String;
  logo: String;
  website: String;
  id: String;
  createdBy: Schema.Types.ObjectId;
}
