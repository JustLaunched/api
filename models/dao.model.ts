import type { IDao } from '../types';
import mongoose from 'mongoose';
import validator from 'validator';

const Schema = mongoose.Schema;

const daoSchema = new Schema<IDao>(
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
    logo: {
      type: String,
      default: function () {
        return `https://avatars.dicebear.com/api/identicon/${this.alias}.svg?background=%23FFFFFF`;
      }
    },
    coverImage: {
      type: String,
      default: function () {
        return 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80';
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
      required: 'createdBy is required'
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
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

daoSchema.virtual('token', {
  ref: 'Token',
  foreignField: 'dao',
  localField: '_id',
  justOne: true
});

daoSchema.virtual('upvotes', {
  ref: 'Upvote',
  foreignField: 'dao',
  localField: '_id',
  count: true
});

export const Dao = mongoose.model('Dao', daoSchema);
