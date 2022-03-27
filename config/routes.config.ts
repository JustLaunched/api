import { upvote } from './../controllers/upvotes.controller';
import { existingUserChecker } from './../middlewares/existingUserChecker.middleware';
import { isUserOwner } from './../middlewares/isUserOwner.middleware';
import type { Router } from 'express';
import express from 'express';
// config
import storage from './storage.config';
// middlewares
import { isAuthenticated, isProductOwner, existingProductChecker } from '../middlewares';
// controllers
import { product, user } from '../controllers';

const router: Router = express.Router();

// Upvotes
router.post('/product/:alias/upvote', isAuthenticated, upvote.upvoteProduct);
router.delete('/product/:alias/upvote', isAuthenticated, upvote.downvoteProduct);

// Products
router.post('/product', isAuthenticated, product.create);
router.get('/product/:alias', product.get);
router.put('/product/:alias/update', isAuthenticated, existingProductChecker, isProductOwner, product.updateCommons);
router.put(
  '/product/:alias/update-logo',
  isAuthenticated,
  existingProductChecker,
  isProductOwner,
  storage.single('logo'),
  product.updateLogo
);
router.put(
  '/product/:alias/update-cover-image',
  isAuthenticated,
  existingProductChecker,
  isProductOwner,
  storage.single('coverImage'),
  product.updateCoverImage
);
router.delete('/product/:alias', isAuthenticated, existingProductChecker, isProductOwner, product.remove);

// Users
router.post('/user', user.create);
router.get('/user/:address', user.get);
router.put('/user/:address/update-profile', isAuthenticated, existingUserChecker, isUserOwner, user.updateProfile);
router.put(
  '/user/:address/update-avatar',
  isAuthenticated,
  existingUserChecker,
  isUserOwner,
  storage.single('avatar'),
  user.updateAvatar
);
router.put(
  '/user/:address/update-cover-image',
  isAuthenticated,
  existingUserChecker,
  isUserOwner,
  storage.single('coverImage'),
  user.updateCoverImage
);
router.delete('/user/:address/delete', isAuthenticated, existingUserChecker, isUserOwner, user.deleteUser);

// Auth
router.post('/login', user.login);
router.post('/logout', isAuthenticated, user.logout);

export default router;
