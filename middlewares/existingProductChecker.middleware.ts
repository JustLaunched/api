import { IProduct } from '../types/product.types'
import { Product } from '../models';
import { RequestHandler } from 'express';
import createError from 'http-errors';

export const existingProductChecker: RequestHandler = (req, res, next) => {
  Product.findOne({ alias: req.params.alias.toLowerCase() })
    .then((product: IProduct) => {
      if (!product) {
        next(createError(404, 'Product not found'));
      } else {
        res.locals.product = product;
        next();
      }
    })
    .catch(() => next(createError(500, 'Internal Server Error')))
};
