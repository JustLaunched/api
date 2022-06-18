const upvote = require('../controllers/upvotes.controller')
const existingUserChecker = require('../middlewares/existingUserChecker.middleware');
const isUserOwner = require('../middlewares/isUserOwner.middleware');
const express = require('express');
// config
const storage = require('./storage.config');
// middlewares
const isAuthenticated = require('../middlewares/isAuthenticated.middleware');
const isProductOwner = require('../middlewares/isProductOwner.middleware');
const existingProductChecker = require('../middlewares/existingProductChecker.middleware');
// controllers
const product = require('../controllers/products.controller')
const user = require('../controllers/users.controller')

const router = express.Router();

// Test
router.get('/', (req, res, next) => res.json('hello world'));

// Upvotes
router.post('/product/:alias/upvote', isAuthenticated, upvote.upvoteProduct);
router.delete('/product/:alias/upvote', isAuthenticated, upvote.downvoteProduct);

// Products
router.get('/feed', product.feed);
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
router.get('/products', product.posts)

// Users
router.post('/user', user.create);
router.get('/user/:address', user.get);
router.get('/user/:address/products', user.getUserProducts);
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

module.exports = router;
