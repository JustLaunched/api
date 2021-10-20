import { IUser } from './../types';
import { RequestHandler } from 'express';
import createError from 'http-errors';

export const isUserOwner: RequestHandler = (req, res, next) => {
  const loggedUser = req.user;
  if (res.locals.user.id.toString() === loggedUser.id.toString()) {
    next();
  } else {
    next(createError(403, 'Only user owner can perform this action'));
  }
};
