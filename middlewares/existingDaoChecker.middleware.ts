import { IDao } from './../@types';
import { Dao } from './../models';
import { RequestHandler } from 'express';
import createError from 'http-errors';

export const existingDaoChecker: RequestHandler = (req, res, next) => {
  Dao.findOne({ alias: req.params.alias }).then((dao: IDao) => {
    if (!dao) {
      next(createError(404, 'DAO not found'));
    } else {
      res.locals.dao = dao;
      next();
    }
  });
};
