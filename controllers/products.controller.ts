import { IUser } from './../types/users.types';
import { getPublicIdFromImagePath } from '../utils';
import createError from 'http-errors';
import type { RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import type { IProduct, IUpvote } from '../types';
import { Product, Upvote, User } from '../models';

const create: RequestHandler = (req, res, next) => {
  const { name, alias, tagline, description, logo, website, gallery } = req.body;
  const productData = {
    name,
    alias: alias.toLowerCase(),
    tagline,
    description,
    logo,
    website: website.toLowerCase(),
    createdBy: req.user.id,
    gallery
  };

  Product.findOne({ alias }).then((product: IProduct) => {
    if (product) {
      return next(createError(400, { errors: { alias: 'This alias is taken' } }));
    } else {
      Product.create(productData)
        .then((product) => {
          res.status(201).json(product);
        })
        .catch(next);
    }
  });
};

const get: RequestHandler = (req, res, next) => {
  const { alias } = req.params;
  Product.findOne({ alias: alias.toLowerCase() })
    .populate('upvotes')
    .then((product: IProduct) => {
      if (!product) {
        return next(createError(404, 'Product not found'));
      } else {
        User.findById(product.createdBy, 'address avatar').then((user: IUser) => {
          if (!user) {
            return next(createError(404, 'The user has removed its profile'));
          }
          if (req.user) {
            Upvote.findOne({
              upvotedBy: req.user.id,
              product: product.id
            }).then((upvote: IUpvote) => {
              const newProduct = product.toObject();
              if (upvote) {
                newProduct.upvoted = true;
              } else {
                newProduct.upvoted = false;
              }
              return res.status(200).json(newProduct);
            });
          }
          const newProduct = product.toObject();
          newProduct.upvoted = false;
          res.status(200).json({ ...newProduct, user });
        });
      }
    })
    .catch(next);
};

const updateCommons: RequestHandler = (req, res, next) => {
  const {
    name: newName,
    tagline: newTagLine,
    alias: newAlias,
    description: newDescription,
    website: newWebsite,
    twitter: newTwitter,
    discord: newDiscord,
    telegram: newTelegram,
    gallery: newGallery
  } = req.body;
  const { alias: aliasFromParams } = req.params;
  const alias = aliasFromParams.toLowerCase();
  const product: IProduct = res.locals.product;

  Object.assign(product, {
    name: newName,
    alias: newAlias?.toLowerCase(),
    tagline: newTagLine,
    description: newDescription,
    website: newWebsite?.toLowerCase(),
    twitter: newTwitter?.toLowerCase(),
    discord: newDiscord?.toLowerCase(),
    telegram: newTelegram?.toLowerCase(),
    gallery: newGallery
  });
  Product.findOneAndUpdate({ alias }, product, { runValidators: true, new: true, useFindAndModify: false })
    .then((product: IProduct) => res.status(202).json(product))
    .catch(next);
};

const updateLogo: RequestHandler = (req, res, next) => {
  let prevImagePublicId = '';
  const product: IProduct = res.locals.product;
  if (req.file) {
    prevImagePublicId = getPublicIdFromImagePath(product.logo);
    Object.assign(product, { logo: req.file.path });
    Product.findByIdAndUpdate(product.id, product, { runValidators: true, new: true, useFindAndModify: false })
      .then((updatedProduct: IProduct) => {
        const newImagePublicId = getPublicIdFromImagePath(req.file.path);
        if (prevImagePublicId && prevImagePublicId !== newImagePublicId) {
          cloudinary.uploader.destroy(prevImagePublicId);
        }
        res.status(202).json(updatedProduct);
      })
      .catch(next);
  } else {
    next(createError(404, "You must include a file for updating the product's logo"));
  }
};

const updateCoverImage: RequestHandler = (req, res, next) => {
  let prevImagePublicId = '';
  const product: IProduct = res.locals.product;

  if (req.file) {
    prevImagePublicId = getPublicIdFromImagePath(product.coverImage);
    Object.assign(product, { coverImage: req.file.path });
    Product.findByIdAndUpdate(product.id, product, { runValidators: true, new: true, useFindAndModify: false })
      .then((product: IProduct) => {
        const newImagePublicId = getPublicIdFromImagePath(req.file.path);
        if (prevImagePublicId && prevImagePublicId !== newImagePublicId) {
          cloudinary.uploader.destroy(prevImagePublicId);
        }
        res.status(202).json(product);
      })
      .catch(next);
  } else {
    next(createError(404, "You must include a file for updating the product's cover image"));
  }
};

const remove: RequestHandler = (req, res, next) => {
  const product = res.locals.product as IProduct;

  return Product.findByIdAndDelete(product.id)
    .then(() => res.status(204).end())
    .catch(next);
};

const feed: RequestHandler = async (req, res, next) => {
  const limit = 10;
  const skip = 0;

  try {
    const productList = await Product.find({}, 'name alias logo tagline createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('upvotes');

    const newProducts = productList.map(async (product: IProduct) => {
      let upvotedByMe = false;

      if (req.user) {
        upvotedByMe = await Upvote.findOne({
          upvotedBy: req.user.id,
          product: product.id
        });
      }

      const newProduct = product.toObject();

      if (upvotedByMe) {
        newProduct.upvoted = true;
      } else {
        newProduct.upvoted = false;
      }

      return newProduct;
    });
    const products = await Promise.all(newProducts);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const product = {
  create,
  get,
  updateCommons,
  updateLogo,
  updateCoverImage,
  remove,
  feed
};
