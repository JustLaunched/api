import { IUser } from './../types';
import { User } from './../models';
import { RequestHandler } from 'express';
import createError from 'http-errors';

export const existingUserChecker: RequestHandler = (req, res, next) => {
  User.findOne({ address: req.params.address.toLowerCase() })
    .then((user: IUser) => {
      if (!user) {
        next(createError(404, 'User not found'));
      } else {
        next();
      }
    })
    .catch(() => next(createError(500, 'Internal Server Error')));
};
