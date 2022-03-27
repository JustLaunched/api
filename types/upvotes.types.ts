import { Schema } from 'mongoose';

export interface IUpvote {
  upvotedBy: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  id: string;
}
