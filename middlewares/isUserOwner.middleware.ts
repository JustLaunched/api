import { RequestHandler } from 'express';
import createError from 'http-errors';

export const isUserOwner: RequestHandler = (req, res, next) => {
  if (req.params.address.toLowerCase() === req.user.address.toLowerCase()) {
    next();
  } else {
    next(createError(403, 'Only user owner can perform this action'));
  }
};
