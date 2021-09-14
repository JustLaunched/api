import mongoose from 'mongoose';
import validator from 'validator';

const Schema = mongoose.Schema;

const daoSchema = new Schema(
  {
    name: {
      type: String,
      required: 'Name is required'
    },
    alias: {
      type: String,
      required: 'Alias is required',
      unique: true,
      validate: (value: string) => {
        if (!validator.isAlphanumeric(value)) {
          throw new Error('Alias can only contain letters and numbers');
        }
      }
    },
    description: {
      type: String,
      required: 'Description is required'
    },
    tokenLaunched: {
      type: Boolean,
      required: 'Token Launched is required'
    },
    tokenName: {
      type: String
    },
    tokenAddress: {
      type: String,
      validate: (value: string) => {
        if (value && !validator.isEthereumAddress(value)) {
          throw new Error('Invalid contract address.');
        }
      }
    },
    logo: {
      type: String,
      default: function () {
        return `https://avatars.dicebear.com/api/identicon/${this.name}.svg?background=%23FFFFFF`;
      }
    },
    website: {
      type: String,
      validate: (value: string) => {
        if (value && !validator.isURL(value, { require_protocol: true })) {
          throw new Error('Invalid URL.');
        }
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Dao = mongoose.model('Dao', daoSchema);

export default Dao;
