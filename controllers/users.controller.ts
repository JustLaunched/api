import type { IUser } from './../@types';
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
  const { username, fullName, bio, website, ethAddress, email } = req.body;
  // TODO => avatar & cover image
  if (req.user.username !== req.params.username) {
    next(createError(404, 'Only account owner can edit its profile'));
  }

  Object.assign(req.user, { username, fullName, bio, website, ethAddress, email });
  User.findByIdAndUpdate(req.user.id, req.user, { runValidators: true, new: true, useFindAndModify: false })
    .then((user) => res.status(202).json(user))
    .catch(next);
};

const updateAvatar: RequestHandler = (req, res, next) => {
  if (req.user.username !== req.params.username) {
    next(createError(404, 'Only account owner can edit its profile'));
  }

  if (req.file) {
    Object.assign(req.user, { avatar: req.file.path });
    User.findByIdAndUpdate(req.user.id, req.user, { runValidators: true, new: true, useFindAndModify: false })
      .then((user) => res.status(202).json(user))
      .catch(next);
  } else {
    next(createError(404, 'You must include a file for updating your avatar'));
  }
};

const updatePassword: RequestHandler = (req, res, next) => {
  const { prevPassword, newPassword, confirmPassword } = req.body;

  if (req.user.username !== req.params.username) {
    next(createError(404, 'Only account owner can edit its profile'));
  }
  if (newPassword !== confirmPassword) {
    next(createError(400, 'Passwords do not match'));
  }

  User.findById(req.user.id)
    .select('+password')
    .then((user) => {
      user.checkPassword(prevPassword).then((match) => {
        if (!match) {
          next(createError(400, 'Incorrect password'));
        }
        user.password = newPassword;
        user
          .save({ validateBeforeSave: true })
          .then((user) => res.status(202).json(user))
          .catch(next);
      });
    })
    .catch(next);
};

const deleteUser: RequestHandler = (req, res, next) => {
  User.findOne({ name: req.params.username })
    .then((user) => {
      if (!user) {
        return next(createError(404, 'User not found'));
      }
      if (req.params.username !== req.user.username) {
        return next(createError(400, 'Only the owner can perform this action'));
      }
      User.findOne({ username: req.params.username }).then(() => {
        Dao.deleteMany({ createdBy: user.id }).then(() => {
          Upvote.deleteMany({ upvotedBy: user.id }).then(() => {
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
