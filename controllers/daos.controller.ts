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
  const { alias } = req.params;
  Dao.findOne({ alias })
    .then((dao: IDao) => {
      if (!dao) return next(createError(404, 'DAO not found'));
      else res.status(200).json(dao);
    })
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  const { alias } = req.params;
  Dao.findOne({ alias })
    .then((dao: IDao) => {
      if (!dao) {
        return next(createError(404, 'DAO not found'));
      }
      // else if (dao.owner != req.user.id) return next(createError(403, 'Only the owner can perform this action.'));
      else {
        Dao.findByIdAndDelete(dao.id).then(() => res.status(204).end());
      }
    })
    .catch(next);
};

export const dao = {
  create,
  get,
  remove
};
