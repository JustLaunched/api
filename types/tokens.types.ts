import { Schema } from 'mongoose';

export interface IToken {
  tokenName: string;
  tokenLaunched: boolean;
  tokenAddress: string;
  dao: Schema.Types.ObjectId;
}
