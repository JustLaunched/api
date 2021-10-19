import { IUser } from './../@types';
import { User } from './../models';
import { RequestHandler } from 'express';
import createError from 'http-errors';

export const existingUserChecker: RequestHandler = (req, res, next) => {
  User.findOne({ username: req.params.username.toLowerCase() }).then((user: IUser) => {
    if (!user) {
      next(createError(404, 'DAO not found'));
    } else {
      res.locals.user = user;
      next();
    }
  });
};
