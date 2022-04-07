import { RequestHandler } from 'express';
import createError from 'http-errors';
import { IProduct, IUpvote } from '../types';
import { Product, Upvote } from '../models';

const upvoteProduct: RequestHandler = (req, res, next) => {
  Product.findOne({ alias: req.params.alias })
    .then((product: IProduct) => {
      if (!product) {
        next(createError(404, 'This product does not exist'));
      } else {
        Upvote.findOne({ upvotedBy: req.user.id, product: product.id }).then((upvote: IUpvote) => {
          if (upvote) next(createError(400, 'You already upvoted this product'));
          else {
            Upvote.create({ upvotedBy: req.user.id, product: product.id }).then(() =>
              res.status(200).json({
                status: 'success',
                message: 'You have upvoted this product'
              })
            );
          }
        });
      }
    })
    .catch(next);
};

const downvoteProduct: RequestHandler = (req, res, next) => {
  Product.findOne({ alias: req.params.alias })
    .then((product: IProduct) => {
      if (!product) {
        next(createError(404, 'This post does not exist'));
      } else {
        Upvote.findOne({ upvotedBy: req.user.id, product: product.id }).then((upvote: IUpvote) => {
          if (!upvote) next(createError(400, 'You have not upvoted this product'));
          Upvote.findOneAndDelete({ _id: upvote.id }).then(() => {
            res.status(200).json({
              status: 'success',
              message: 'You have downvoted this product'
            });
          });
        });
      }
    })
    .catch(next);
};

export const upvote = {
  upvoteProduct,
  downvoteProduct
};
