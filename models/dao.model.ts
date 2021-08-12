import mongoose from 'mongoose';
import validator from 'validator';

const Schema = mongoose.Schema;

const daoSchema = new Schema(
  {
    name: {
      type: String,
      required: 'Name is required'
    },
    description: {
      type: String,
      required: 'Description is required'
    },
    tokenLaunched: {
      type: Boolean,
      required: 'This field is required'
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
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

const Dao = mongoose.model('Dao', daoSchema);

export default Dao;
