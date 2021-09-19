import type { IUser } from './../@types/users.types';
import type { RequestHandler } from 'express';
import createError from 'http-errors';
import passport from 'passport';
import User from '../models/user.model';

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

const login: RequestHandler = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validations) => {
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
  logout
};
