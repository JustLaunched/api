import { IToken } from './../@types/tokens.types';
import createError from 'http-errors';
import type { RequestHandler } from 'express';
import type { IDao } from '../@types/daos.types';
import Dao from '../models/dao.model';
import Token from '../models/token.model';

const create: RequestHandler = (req, res, next) => {
  const { name, alias, description, logo, website, tokenName, tokenLaunched, tokenAddress } = req.body;
  const daoData = { name, alias, description, logo, website, createdBy: '6140d7d68d26834c2f6a93dc' };
  const tokenData = { tokenLaunched, tokenName, tokenAddress };

  Dao.findOne({ alias }).then((dao: IDao) => {
    if (dao) {
      return next(createError(400, { errors: { alias: 'This alias is taken' } }));
    } else {
      Dao.create(daoData)
        .then((dao) => {
          if (!tokenLaunched) {
            res.status(201).json(dao);
          } else {
            Token.create({ ...tokenData, dao: dao.id })
              .then((token) => {
                res.status(201).json({ dao, token });
              })
              .catch((error) => console.log(error));
          }
        })
        .catch(next);
    }
  });
};

const get: RequestHandler = (req, res, next) => {
  const { alias } = req.params;
  Dao.findOne({ alias })
    .populate('token')
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
        return Dao.findByIdAndDelete(dao.id).then(() => res.status(204).end());
      }
    })
    .catch(next);
};

export const dao = {
  create,
  get,
  remove
};
