const createError = require('http-errors');
// models
const User = require('../models/user.model');

const existingUserChecker = (req, res, next) => {
  User.findOne({ address: req.params.address.toLowerCase() })
    .then((user) => {
      if (!user) {
        next(createError(404, 'User not found'));
      } else {
        next();
      }
    })
    .catch(() => next(createError(500, 'Internal Server Error')));
};

module.exports = existingUserChecker;
