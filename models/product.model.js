const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: 'Name is required',
      maxlength: [40, 'Name is too long.']
    },
    alias: {
      type: String,
      required: 'Alias is required',
      maxlength: [40, 'Alias is too long.'],
      unique: true,
      validate: (value) => {
        if (!validator.isAlphanumeric(value)) {
          throw new Error('Alias can only contain letters and numbers');
        }
      }
    },
    tagline: {
      type: String,
      required: 'Tagline is required',
      maxlength: [60, 'Tagline is too long.']
    },
    description: {
      type: String,
      required: 'Description is required',
      minlength: [60, 'Description is too short'],
      maxlength: [1000, 'Description is too long.']
    },
    logo: {
      type: String,
      default () {
        return `https://avatars.dicebear.com/api/identicon/${this.alias}.svg?background=%23FFFFFF`;
      }
    },
    coverImage: {
      type: String,
      default () {
        return 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80';
      }
    },
    gallery: {
      type: [String]
    },
    twitter: {
      type: String,
      maxlength: [150, 'Twitter URL is too long.'],
      validate: (value) => {
        if (value && !validator.isURL(value, { require_protocol: true })) {
          throw new Error('Invalid URL.');
        }
      }
    },
    discord: {
      type: String,
      maxlength: [150, 'Discord URL is too long.'],
      validate: (value) => {
        if (value && !validator.isURL(value, { require_protocol: true })) {
          throw new Error('Invalid URL.');
        }
      }
    },
    telegram: {
      type: String,
      maxlength: [150, 'Telegram URL is too long.'],
      validate: (value) => {
        if (value && !validator.isURL(value, { require_protocol: true })) {
          throw new Error('Invalid URL.');
        }
      }
    },
    website: {
      type: String,
      required: 'Website is required',
      maxlength: [150, 'Website URL is too long.'],
      validate: (value) => {
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

productSchema.virtual('upvotes', {
  ref: 'Upvote',
  foreignField: 'product',
  localField: '_id',
  count: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
