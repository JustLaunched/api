const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const upvoteSchema = new Schema(
  {
    upvotedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  },
  {
    toJSON: {
      transform (doc, ret) {
        delete ret._id;
        delete ret.__v;
        ret.id = doc.id;
        return ret;
      }
    }
  }
);

const Upvote = mongoose.model('Upvote', upvoteSchema);
module.exports = Upvote;
