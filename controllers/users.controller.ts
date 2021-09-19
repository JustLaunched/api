import type { IUser } from './../@types/users.types';
import type { RequestHandler } from 'express';
import createError from 'http-errors';
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

export const user = {
  create,
  get
};
