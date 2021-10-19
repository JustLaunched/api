import type { Router } from 'express';
import express from 'express';
// config
import storage from './storage.config';
// middlewares
import { isAuthenticated, isDaoOwner, existingDaoChecker } from '../middlewares';
// controllers
import { dao, user } from '../controllers';

const router: Router = express.Router();

// DAOs
router.post('/dao', isAuthenticated, dao.create);
router.get('/dao/:alias', dao.get);
router.put('/dao/:alias/update', isAuthenticated, existingDaoChecker, isDaoOwner, dao.updateCommons);
router.put(
  '/dao/:alias/update-logo',
  isAuthenticated,
  existingDaoChecker,
  isDaoOwner,
  storage.single('logo'),
  dao.updateLogo
);
router.put(
  '/dao/:alias/update-cover-image',
  isAuthenticated,
  existingDaoChecker,
  isDaoOwner,
  storage.single('coverImage'),
  dao.updateCoverImage
);
router.delete('/dao/:alias', isAuthenticated, existingDaoChecker, isDaoOwner, dao.remove);

// Users
router.post('/user', user.create);
router.get('/user/:username', user.get);
router.put('/user/:username/update-profile', isAuthenticated, user.updateProfile);
router.put('/user/:username/update-avatar', isAuthenticated, storage.single('avatar'), user.updateAvatar);
router.put('/user/:username/update-password', isAuthenticated, user.updatePassword);
router.delete('/user/:username/delete', isAuthenticated, user.deleteUser);

// Auth
router.post('/login', user.login);
router.post('/logout', isAuthenticated, user.logout);

export default router;
