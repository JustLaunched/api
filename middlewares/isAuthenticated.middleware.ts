import { RequestHandler } from 'express';
import createError from 'http-errors';

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(createError(401, 'User is not authenticated'));
  }
};
