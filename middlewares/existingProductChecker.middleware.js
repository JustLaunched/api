const createError = require('http-errors');
// models
const Product = require('../models/product.model');

const existingProductChecker = (req, res, next) => {
  Product.findOne({ alias: req.params.alias.toLowerCase() })
    .then((product) => {
      if (!product) {
        next(createError(404, 'Product not found'));
      } else {
        res.locals.product = product;
        next();
      }
    })
    .catch(() => next(createError(500, 'Internal Server Error')))
};
module.exports = existingProductChecker;
