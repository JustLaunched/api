import type { IUserProfile, IUser } from './../types';
import type { RequestHandler } from 'express';
import createError from 'http-errors';
import passport from 'passport';
import { User, Dao, Upvote } from '../models';

const create: RequestHandler = (req, res, next) => {
  User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
    .then((user: IUser) => {
      if (user) {
        if (req.body.email === user.email) {
          next(createError(400, { errors: { email: 'This email already exists' } }));
        } else {
          next(createError(400, { errors: { username: 'This username is taken' } }));
        }
      } else {
        const newUser = User.create(req.body).then((user) => res.status(201).json(user));
        return newUser;
      }
    })
    .catch(next);
};

const get: RequestHandler = (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username })
    .then((user: IUser) => {
      if (!user) next(createError(404, 'User not found'));
      else {
        res.status(200).json(user);
      }
    })
    .catch(next);
};

const updateProfile: RequestHandler = (req, res, next) => {
  const updatedUser: IUserProfile = {
    username: req.body.user,
    fullName: req.body.fullName,
    bio: req.body?.bio,
    website: req.body.website,
    ethAddress: req.body.ethAddress,
    email: req.body.email
  };
  const loggedUser = JSON.parse(JSON.stringify(req.user));

  Object.keys(updatedUser).forEach((key: keyof IUserProfile) => {
    if (updatedUser[key] === undefined) {
      delete updatedUser[key];
    }
  });
  User.findByIdAndUpdate(
    req.user.id,
    { ...loggedUser, ...updatedUser },
    { runValidators: true, new: true, useFindAndModify: false }
  )
    .then((user) => res.status(202).json(user))
    .catch(next);
};

const updateAvatar: RequestHandler = (req, res, next) => {
  if (req.file) {
    User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { runValidators: true, new: true, useFindAndModify: false }
    )
      .then((user) => res.status(202).json(user))
      .catch(next);
  } else {
    next(createError(404, 'You must include a file for updating your avatar'));
  }
};

const updatePassword: RequestHandler = (req, res, next) => {
  const { prevPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    next(createError(400, 'Passwords do not match'));
  }

  User.findById(req.user.id)
    .select('+password')
    .then((user) => {
      user.checkPassword(prevPassword).then((match: boolean) => {
        if (!match) {
          next(createError(400, 'Incorrect password'));
        }
        user.password = newPassword;
        user
          .save({ validateBeforeSave: true })
          .then((user: IUser) => res.status(202).json(user))
          .catch(next);
      });
    })
    .catch(next);
};

const deleteUser: RequestHandler = (req, res, next) => {
  User.findOne({ username: req.params.username.toLowerCase() })
    .then((user) => {
      console.log(user);
      Dao.deleteMany({ createdBy: user.id }).then(() => {
        Upvote.deleteMany({ upvotedBy: user.id }).then(() => {
          User.findByIdAndDelete(user.id).then(() => {
            res.status(204).json({ message: 'Your account has been removed' });
          });
        });
      });
    })
    .catch(next);
};

const login: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      next(createError(400, { errors: validations }));
    } else {
      req.login(user, (error) => {
        if (error) next(error);
        else res.json(user);
      });
    }
  })(req, res, next);
};

const logout: RequestHandler = (req, res, next) => {
  req.logout();

  res.status(204).end();
};

export const user = {
  create,
  get,
  login,
  logout,
  updateProfile,
  updateAvatar,
  updatePassword,
  deleteUser
};
