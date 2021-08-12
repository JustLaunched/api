import type { Router } from 'express';
import express from 'express';
import { dao } from '../controllers/daos.controller';

export const router: Router = express.Router();

router.post('/dao', dao.create);
