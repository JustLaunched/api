import passport from 'passport';
import User from '../models/user.model';
import * as PassportLocal from 'passport-local';

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
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, next) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            next(null, null, { message: 'Invalid email or password' });
          } else {
            return user.checkPassword(password).then((match) => {
              if (match) {
                next(null, user);
              } else {
                next(null, null, { message: 'Invalid email or password' });
              }
            });
          }
        })
        .catch(next);
    }
  )
);

export default passport;