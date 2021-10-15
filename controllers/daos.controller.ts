import createError, { UnavailableForLegalReasons } from 'http-errors';
import type { RequestHandler } from 'express';
import type { IDao } from '../@types/daos.types';
import Dao from '../models/dao.model';
import Token from '../models/token.model';

const create: RequestHandler = (req, res, next) => {
  const { name, alias, description, logo, website, tokenName, tokenLaunched, tokenAddress } = req.body;
  const daoData = {
    name,
    alias: alias.toLowerCase(),
    description,
    logo,
    website: website.toLowerCase(),
    createdBy: req.user.id
  };
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
  Dao.findOne({ alias: alias.toLowerCase() })
    .populate('token')
    .populate('upvote')
    .then((dao: IDao) => {
      if (!dao) return next(createError(404, 'DAO not found'));
      else res.status(200).json(dao);
    })
    .catch(next);
};

const update: RequestHandler = (req, res, next) => {
  const { name: newName, alias: newAlias, description: newDescription, website: newWebsite } = req.body;
  const { alias: aliasFromParams } = req.params;
  const alias = aliasFromParams.toLowerCase();
  // TODO => logo & cover image
  Dao.findOne({ alias })
    .then((dao: IDao) => {
      if (!dao) {
        next(createError(404, 'DAO not found'));
      }
      if (req.user.id!.toString() !== dao.createdBy!.toString()) {
        next(createError(404, 'Only DAO creator can perform this action'));
      }
      Object.assign(dao, {
        name: newName,
        alias: newAlias?.toLowerCase(),
        description: newDescription,
        website: newWebsite?.toLowerCase()
      });
      Dao.findOneAndUpdate({ alias }, dao, { runValidators: true, new: true, useFindAndModify: false })
        .then((dao: IDao) => res.status(202).json(dao))
        .catch(next);
    })
    .catch(next);
};

const remove: RequestHandler = (req, res, next) => {
  const { alias } = req.params;
  Dao.findOne({ alias })
    .then((dao: IDao) => {
      if (!dao) {
        return next(createError(404, 'DAO not found'));
      } else if (dao.createdBy !== req.user.id)
        return next(createError(403, 'Only the owner can perform this action.'));
      else {
        return Dao.findByIdAndDelete(dao.id).then(() => res.status(204).end());
      }
    })
    .catch(next);
};

export const dao = {
  create,
  get,
  update,
  remove
};
