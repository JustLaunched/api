import validator from 'validator';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    tokenName: {
      type: String
    },
    tokenLaunched: {
      type: Boolean,
      required: 'Token Launched is required'
    },
    tokenAddress: {
      type: String,
      validate: (value: string) => {
        if (value && !validator.isEthereumAddress(value)) {
          throw new Error('Invalid contract address.');
        }
      }
    },
    dao: {
      type: Schema.Types.ObjectId,
      ref: 'Dao',
      required: true
    }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        ret.id = doc.id;
        return ret;
      }
    }
  }
);

const Token = mongoose.model('Token', tokenSchema);
export default Token;
