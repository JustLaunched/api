import createError from 'http-errors';
import Dao from '../models/dao.model';
import Upvote from '../models/upvote.model';

const upvoteDao = (req, res, next) => {
  Dao.find({ alias: req.params.alias })
    .then((dao) => {
      if (!dao) {
        next(createError(404, 'This DAO does not exist'));
      } else {
        Upvote.findOne({ upvotedBy: req.user.id, dao: dao.id }).then((upvote) => {
          if (upvote) next(createError(400, 'You already upvoted this DAO'));
          else {
            Upvote.create({ upvotedBy: req.user.id, dao: dao.id }).then(() =>
              res.status(200).json({
                status: 'success',
                message: 'You have upvoted this DAO'
              })
            );
          }
        });
      }
    })
    .catch(next);
};

const downvoteDao = (req, res, next) => {
  Dao.find({ alias: req.params.alias })
    .then((dao) => {
      if (!dao) next(createError(404, 'This post does not exist'));
      else {
        Upvote.findOne({ upvotedBy: req.user.id, dao: dao.id }).then((upvote) => {
          Upvote.findOneAndDelete({ id: upvote.id }).then(() => {
            res.status(200).json({
              status: 'success',
              message: 'You have downvoted this DAO'
            });
          });
        });
      }
    })
    .catch(next);
};

export const upvote = {
  upvoteDao,
  downvoteDao
};
