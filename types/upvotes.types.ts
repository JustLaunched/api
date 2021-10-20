import { Schema } from 'mongoose';

export interface IUpvote {
  upvotedBy: Schema.Types.ObjectId;
  dao: Schema.Types.ObjectId;
  id: string;
}
