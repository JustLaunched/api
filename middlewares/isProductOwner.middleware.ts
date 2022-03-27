import { RequestHandler } from 'express';
import createError from 'http-errors';

export const isProductOwner: RequestHandler = (req, res, next) => {
  if (res.locals.product.createdBy.toString() === req.user.id.toString()) {
    next();
  } else {
    next(createError(403, 'Only product owner can perform this action'));
  }
};
