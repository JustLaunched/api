import type { Router } from 'express';
import express from 'express';
import { dao } from '../controllers/daos.controller';
import { user } from '../controllers/users.controller';

export const router: Router = express.Router();

// DAOs
router.post('/dao', dao.create);
router.get('/dao/:alias', dao.get);
router.delete('/dao/:alias', dao.remove);

// Users
router.post('/user', user.create);
router.get('/user/:username', user.get);

// Auth
router.post('/login', user.login);
router.post('/logout', user.logout);
