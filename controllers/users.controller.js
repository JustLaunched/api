const createError = require('http-errors');
const passport = require('passport');
// models
const Product = require('../models/product.model');
const Upvote = require('../models/upvote.model');
const User = require('../models/user.model');

const create = (req, res, next) => {
  User.findOne({ adress: req.body.address })
    .then((user) => {
      if (user) {
        res.redirect('/login');
      } else {
        const newUser = User.create(req.body).then((user) => res.status(201).json(user));
        return newUser;
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  User.findOne({ address: req.body.address })
    .then((user) => {
      if (user) {
        passport.authenticate('local', (error, user) => {
          if (error) {
            next(error);
          } else {
            req.login(user, (error) => {
              if (error) next(error);
              else res.json(user);
            });
          }
        })(req, res, next);
      } else {
        User.create(req.body).then(() => {
          passport.authenticate('local', (error, user) => {
            if (error) {
              next(error);
            } else {
              req.login(user, (error) => {
                if (error) next(error);
                else res.json(user);
              });
            }
          })(req, res, next);
        });
      }
    })
    .catch(next);
};

const logout = (req, res, next) => {
  req.logout();

  res.status(204).end();
};

const get = (req, res, next) => {
  const { address } = req.params;
  User.findOne({ address })
    .then((user) => {
      if (!user) next(createError(404, 'User not found'));
      else {
        res.status(200).json(user);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const updatedUser = {
    about: req.body?.about,
    website: req.body?.website,
    email: req.body?.email,
    twitter: req.body?.twitter
  };
  const loggedUser = JSON.parse(JSON.stringify(req.user));

  Object.keys(updatedUser).forEach((key) => {
    if (updatedUser[key] === undefined) {
      delete updatedUser[key];
    }
  });
  User.findByIdAndUpdate(
    req.user.id,
    { ...loggedUser, ...updatedUser },
    { runValidators: true, new: true, useFindAndModify: false }
  )
    .then((user) => res.status(202).json(user))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  if (req.file) {
    User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { runValidators: true, new: true, useFindAndModify: false }
    )
      .then((user) => res.status(202).json(user))
      .catch(next);
  } else {
    next(createError(404, 'You must include a file for updating your avatar'));
  }
};

const updateCoverImage = (req, res, next) => {
  if (req.file) {
    User.findByIdAndUpdate(
      req.user.id,
      { coverImage: req.file.path },
      { runValidators: true, new: true, useFindAndModify: false }
    )
      .then((user) => res.status(202).json(user))
      .catch(next);
  } else {
    next(createError(404, 'You must include a file for updating your cover image'));
  }
};

const deleteUser = (req, res, next) => {
  User.findOne({ address: req.params.address.toLowerCase() })
    .then((user) => {
      Product.deleteMany({ createdBy: user.id }).then(() => {
        Upvote.deleteMany({ upvotedBy: user.id }).then(() => {
          User.findByIdAndDelete(user.id).then(() => {
            res.status(204).json({ message: 'Your account has been removed' });
          });
        });
      });
    })
    .catch(next);
};

const getUserProducts = (req, res, next) => {
  const { address } = req.params;
  const limit = 10;
  const skip = Number(req.query.skip);

  User.findOne({ address })
    .then((user) => {
      if (user) {
        Product.countDocuments({ createdBy: user.id }).then((documents) => {
          const pages = documents / limit;
          Product.find({ createdBy: user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .then((products) => {
              res.status(200).json({ products, pages });
            });
        });
      } else {
        next(createError(404, 'User not found'));
      }
    })
    .catch(next);
};

const user = {
  create,
  get,
  getUserProducts,
  login,
  logout,
  updateProfile,
  updateAvatar,
  updateCoverImage,
  deleteUser
};

module.exports = user;
