import createError from 'http-errors';
import type { RequestHandler } from 'express';
import type { IDao } from '../@types/daos.types';
import Dao from '../models/dao.model';

const create: RequestHandler = (req, res, next) => {
  Dao.findOne({ alias: req.body.alias }).then((dao: IDao) => {
    if (dao) {
      return next(createError(400, { errors: { alias: 'This alias is taken' } }));
    } else {
      Dao.create(req.body)
        .then((dao) => res.status(201).json(dao))
        .catch(next);
    }
  });
};

const get: RequestHandler = (req, res, next) => {
  const { alias } = req.body;
  Dao.find({ alias })
    .then((dao: IDao) => res.status(200).json(dao)) // ToBeTested
    .catch(next);
};

export const dao = {
  create,
  get
};
