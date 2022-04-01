import type { IUser } from './../types';
import mongoose from 'mongoose';
import validator from 'validator';
import createError from 'http-errors';

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      required: 'Ethereum address is required',
      lowercase: true,
      unique: true,
      validate: (value: string) => {
        if (value && !validator.isEthereumAddress(value)) {
          throw new Error('Invalid Ethereum address');
        }
      }
    },
    email: {
      type: String,
      lowercase: true,
      validate: (value: string) => {
        if (value && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }
    },
    nonce: {
      type: Number,
      default: (Math.random() * (100000000000 - 0) + 0)
    },
    about: {
      type: String,
      maxlength: [1000, 'About section is too long.'],
    },
    avatar: {
      type: String,
      default () {
        return `https://avatars.dicebear.com/api/identicon/${this.address}.svg?background=%23FFFFFF`;
      }
    },
    coverImage: {
      type: String,
      default () {
        return 'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
      }
    },
    twitter: {
      type: String
    },
    website: {
      type: String,
      validate: (value: string) => {
        if (value && !validator.isURL(value, { require_protocol: true })) {
          throw new Error('Invalid URL.');
        }
      }
    },
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

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const document = await User.findOne({ address: this.address });
      if (document) return next(createError(400, 'A user with that Ethereum address already exists.'));
    } catch (err) {
      return next(createError(400));
    }
  }
});


export const User = mongoose.model<IUser>('User', userSchema);
