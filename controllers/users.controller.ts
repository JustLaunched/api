import type { IUserProfile, IUser, IProduct } from './../types';
import type { RequestHandler } from 'express';
import createError from 'http-errors';
import passport from 'passport';
import { generateNonce } from "../utils"
import { User, Product, Upvote } from '../models';

const create: RequestHandler = (req, res, next) => {
  User.findOne({ adress: req.body.address })
    .then((user: IUser) => {
      if (user) {
        res.redirect('/login');
      } else {
        const newUser = User.create(req.body).then((user) => res.status(201).json(user));
        return newUser;
      }
    })
    .catch(next);
};

const login: RequestHandler = async (req, res, next) => {
  try {

    if(!await User.findOne({ address: req.body.address })) return res.status(400).json("user not found")



  } catch (error) {
    console.log(error)
  }
};

/*const login: RequestHandler = (req, res, next) => {
  User.findOne({ address: req.body.address })
    .then((user: IUser) => {
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
        User.create(req.body).then( () => {
          passport.authenticate('local',  (error, user) => {
            if (error) {
              next(error);
            } else {
              req.login(user, async (error) => {
                if (error) next(error);
                else res.json(user);
                await User.findOneAndUpdate({address: req.body.address}, {nonce: generateNonce()} )
              });
            }
          })(req, res, next);
        });
      }
    })
    .catch(next);
}; */

const logout: RequestHandler = (req, res, next) => {
  req.logout();

  res.status(204).end();
};

const get: RequestHandler = (req, res, next) => {
  const { address } = req.params;
  User.findOne({ address })
    .then((user: IUser) => {
      if (!user) next(createError(404, 'User not found'));
      else {
        res.status(200).json(user);
      }
    })
    .catch(next);
};

const updateProfile: RequestHandler = (req, res, next) => {
  const updatedUser: IUserProfile = {
    about: req.body?.about,
    website: req.body?.website,
    email: req.body?.email,
    twitter: req.body?.twitter
  };
  const loggedUser = JSON.parse(JSON.stringify(req.user));

  Object.keys(updatedUser).forEach((key: keyof IUserProfile) => {
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

const updateAvatar: RequestHandler = (req, res, next) => {
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

const updateCoverImage: RequestHandler = (req, res, next) => {
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

const deleteUser: RequestHandler = (req, res, next) => {
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

const getUserProducts: RequestHandler = (req, res, next) => {
  const { address } = req.params;
  User.findOne({ address })
    .then((user) => {
      if (user) {
        Product.find({ createdBy: user.id }).then((products: IProduct) => {
          res.status(200).json(products);
        });
      } else {
        next(createError(404, 'User not found'));
      }
    })
    .catch(next);
};

const getUserNonce: RequestHandler = async (req, res, next) => {
  const { address } = req.params;
  try {
    const user = await User.findOne({address})
    if(!user) return res.status(404).json("user not found")

    res.status(200).json({nonce: user.nonce});

  } catch (error) {
    res.status(500).json(error);
  }
}

export const user = {
  create,
  get,
  getUserProducts,
  login,
  logout,
  updateProfile,
  updateAvatar,
  updateCoverImage,
  deleteUser,
  getUserNonce,
};
