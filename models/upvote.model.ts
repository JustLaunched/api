import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const upvoteSchema = new Schema(
  {
    upvotedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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

const Upvote = mongoose.model('Upvote', upvoteSchema);
export default Upvote;
