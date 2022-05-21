const passport = require('passport');
const User = require('../models/user.model');
const PassportLocal = require('passport-local');

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user) => next(null, user))
    .catch(next);
});

passport.use(
  new PassportLocal.Strategy(
    {
      usernameField: 'address',
      passwordField: 'address'
    },
    (address, addr, next) => {
      User.findOne({ address })
        .then((user) => {
          if (!user) {
            next(null, null, { message: 'User does not exist' });
          } else {
            next(null, user);
          }
        })
        .catch(next);
    }
  )
);

module.exports = passport;
