import type { Router } from 'express';
import express from 'express';

export const routes = () => {
  const router: Router = express.Router();
  return router;
};
