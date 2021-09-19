import type { IUser } from './../@types/users.types';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import createError from 'http-errors';

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: 'Name is required',
      maxlength: [50, 'Your name is too long']
    },
    username: {
      type: String,
      required: 'Username is required',
      unique: true,
      lowercase: true,
      minlength: [3, 'Your username is too short'],
      maxlength: [35, 'Your username is too long'],
      validate: (value: string) => {
        if (!validator.isAlphanumeric(value)) {
          throw new Error('Your username can only contain letters and numbers');
        }
      }
    },
    email: {
      type: String,
      required: 'Email is required',
      unique: [true, 'There is already an account using this email'],
      lowercase: true,
      validate: (value: string) => {
        if (value && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }
    },
    password: {
      type: String,
      required: 'A valid password is required'
      // match: [PASSWORD_PATTERN, 'Invalid password']
    },
    avatar: {
      type: String,
      default: function () {
        return `https://avatars.dicebear.com/api/identicon/${this.username}.svg?background=%23FFFFFF`;
      }
    },
    coverImage: {
      type: String,
      default: function () {
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

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const document = await User.findOne({
        $or: [{ email: this.email }, { username: this.username }]
      });
      if (document) return next(createError(400, 'A user with that email or username already exists.'));
    } catch (err) {
      return next(createError(400));
    }
  }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
