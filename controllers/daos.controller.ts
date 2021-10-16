import createError from 'http-errors';
import type { RequestHandler } from 'express';
import type { IDao, IToken } from '../@types';
import { Dao, Token } from '../models';

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
              .then((token: IToken) => {
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

const updateCommons: RequestHandler = (req, res, next) => {
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

const updateLogo: RequestHandler = (req, res, next) => {
  if (req.file) {
    Dao.findOne({ alias: req.params.alias.toLowerCase() })
      .then((dao: IDao) => {
        if (req.user.id.toString() !== dao.createdBy.toString()) {
          next(createError(404, 'Only dao creator can edit this'));
        }
        Object.assign(dao, { logo: req.file.path });
        Dao.findByIdAndUpdate(dao.id, dao, { runValidators: true, new: true }).then((dao: IDao) =>
          res.status(202).json(dao)
        );
      })
      .catch(next);
  } else {
    next(createError(404, "You must include a file for updating the DAO's logo"));
  }
};

const updateCoverImage: RequestHandler = (req, res, next) => {
  if (req.file) {
    Dao.findOne({ alias: req.params.alias.toLowerCase() })
      .then((dao: IDao) => {
        if (req.user.id.toString() !== dao.createdBy.toString()) {
          next(createError(404, 'Only dao creator can edit this'));
        }
        Object.assign(dao, { coverImage: req.file.path });
        Dao.findByIdAndUpdate(dao.id, dao, { runValidators: true, new: true }).then((dao: IDao) =>
          res.status(202).json(dao)
        );
      })
      .catch(next);
  } else {
    next(createError(404, "You must include a file for updating the DAO's cover image"));
  }
};

const remove: RequestHandler = (req, res, next) => {
  const { alias } = req.params;
  Dao.findOne({ alias })
    .then((dao: IDao) => {
      if (!dao) {
        return next(createError(404, 'DAO not found'));
      } else if (dao.createdBy !== req.user.id) {
        return next(createError(403, 'Only the owner can perform this action.'));
      } else {
        return Dao.findByIdAndDelete(dao.id).then(() => res.status(204).end());
      }
    })
    .catch(next);
};

export const dao = {
  create,
  get,
  updateCommons,
  updateLogo,
  updateCoverImage,
  remove
};
