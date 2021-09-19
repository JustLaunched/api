import type { IDao } from '../@types/daos.types';
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

const Dao = mongoose.model('Dao', daoSchema);

export default Dao;
