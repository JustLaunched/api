const createError = require('http-errors');

const isUserOwner = (req, res, next) => {
  if (req.params.address.toLowerCase() === req.user.address.toLowerCase()) {
    next();
  } else {
    next(createError(403, 'Only user owner can perform this action'));
  }
};

module.exports = isUserOwner;
