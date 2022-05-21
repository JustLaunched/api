const createError = require('http-errors');
const Product = require('../models/product.model');
const Upvote = require('../models/upvote.model');

const upvoteProduct = (req, res, next) => {
  Product.findOne({ alias: req.params.alias })
    .then((product) => {
      if (!product) {
        next(createError(404, 'This product does not exist'));
      } else {
        Upvote.findOne({ upvotedBy: req.user.id, product: product.id }).then((upvote) => {
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

const downvoteProduct = (req, res, next) => {
  Product.findOne({ alias: req.params.alias })
    .then((product) => {
      if (!product) {
        next(createError(404, 'This post does not exist'));
      } else {
        Upvote.findOne({ upvotedBy: req.user.id, product: product.id }).then((upvote) => {
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

const upvote = {
  upvoteProduct,
  downvoteProduct
};

module.exports = upvote;
