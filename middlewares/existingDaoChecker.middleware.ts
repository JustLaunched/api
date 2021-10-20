import { IDao } from './../types';
import { Dao } from './../models';
import { RequestHandler } from 'express';
import createError from 'http-errors';

export const existingDaoChecker: RequestHandler = (req, res, next) => {
  Dao.findOne({ alias: req.params.alias.toLowerCase() })
    .then((dao: IDao) => {
      if (!dao) {
        next(createError(404, 'DAO not found'));
      } else {
        res.locals.dao = dao;
        next();
      }
    })
    .catch(next(createError(500, 'Internal Server Error')));
};
