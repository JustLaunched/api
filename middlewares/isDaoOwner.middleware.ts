import { RequestHandler } from 'express';
import createError from 'http-errors';

export const isDaoOwner: RequestHandler = (req, res, next) => {
  if (res.locals.dao.createdBy.toString() === req.user.id.toString()) {
    next();
  } else {
    next(createError(403, 'Only DAO owner can perform this action'));
  }
};
