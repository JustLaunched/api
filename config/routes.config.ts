import type { Router } from 'express';
import express from 'express';
import { dao } from '../controllers/daos.controller';
import { user } from '../controllers/users.controller';

export const router: Router = express.Router();

// DAOs
router.post('/dao', dao.create);
router.get('/dao/:alias', dao.get);

// Users
router.post('/user', user.create);
