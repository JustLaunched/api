const createError = require('http-errors');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(createError(401, 'User is not authenticated'));
  }
};

module.exports = isAuthenticated;
