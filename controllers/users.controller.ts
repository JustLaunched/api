import type { RequestHandler } from 'express';
import User from '../models/user.model';

const create: RequestHandler = (req, res, next) => {
  User.create(req.body)
    .then((user) => res.status(201).json(user))
    .catch(next);
};

export const user = {
  create
};
