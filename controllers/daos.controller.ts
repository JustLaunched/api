import type { RequestHandler } from 'express';
import Dao from '../models/dao.model';

const create: RequestHandler = (req, res, next) => {
  Dao.create(req.body)
    .then((dao) => res.status(201).json(dao))
    .catch(next);
};

export const dao = {
  create
};
