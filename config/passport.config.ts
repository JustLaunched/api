import passport from 'passport';
import User from '../models/user.model';
import LocalStrategy from 'passport-local';

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user) => next(null, user))
    .catch(next);
});

passport.use(
  'local-auth',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, next) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            next(null, null, { onSubmit: 'Invalid email or password' });
          } else {
            return user.checkPassword(password).then((match) => {
              if (match) {
                next(null, user);
              } else {
                next(null, null, { onSubmit: 'Invalid email or password' });
              }
            });
          }
        })
        .catch(next);
    }
  )
);
