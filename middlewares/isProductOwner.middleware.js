const createError = require('http-errors');

const isProductOwner = (req, res, next) => {
  if (res.locals.product.createdBy.toString() === req.user.id.toString()) {
    next();
  } else {
    next(createError(403, 'Only product owner can perform this action'));
  }
};

module.exports = isProductOwner;
