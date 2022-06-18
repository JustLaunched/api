const getPublicIdFromImagePath = require('../utils/getPublicIdFromImagePath');
const createError = require('http-errors');
const cloudinary = require('cloudinary').v2;
// models
const Product = require('../models/product.model');
const Upvote = require('../models/upvote.model');
const User = require('../models/user.model');

const create = (req, res, next) => {
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

  Product.findOne({ alias }).then((product) => {
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

const get = (req, res, next) => {
  const { alias } = req.params;
  Product.findOne({ alias: alias.toLowerCase() })
    .populate('upvotes')
    .then((product) => {
      if (!product) {
        return next(createError(404, 'Product not found'));
      } else {
        User.findById(product.createdBy, 'address avatar').then((user) => {
          if (!user) {
            return next(createError(404, 'The user has removed its profile'));
          }
          if (req.user) {
            Upvote.findOne({
              upvotedBy: req.user.id,
              product: product.id
            }).then((upvote) => {
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

const updateCommons = (req, res, next) => {
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
  const product = res.locals.product;

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
    .then((product) => res.status(202).json(product))
    .catch(next);
};

const updateLogo = (req, res, next) => {
  let prevImagePublicId = '';
  const product = res.locals.product;
  if (req.file) {
    prevImagePublicId = getPublicIdFromImagePath(product.logo);
    Object.assign(product, { logo: req.file.path });
    Product.findByIdAndUpdate(product.id, product, { runValidators: true, new: true, useFindAndModify: false })
      .then((updatedProduct) => {
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

const updateCoverImage = (req, res, next) => {
  let prevImagePublicId = '';
  const product = res.locals.product;

  if (req.file) {
    prevImagePublicId = getPublicIdFromImagePath(product.coverImage);
    Object.assign(product, { coverImage: req.file.path });
    Product.findByIdAndUpdate(product.id, product, { runValidators: true, new: true, useFindAndModify: false })
      .then((product) => {
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

const remove = (req, res, next) => {
  const product = res.locals.product;

  return Product.findByIdAndDelete(product.id)
    .then(() => res.status(204).end())
    .catch(next);
};

const feed = async (req, res, next) => {
  const limit = 10;
  const skip = Number(req.query.skip);

  try {
    const productList = await Product.find({}, 'name alias logo tagline createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('upvotes');

    const pages = (await Product.countDocuments({})) / limit;

    const newProducts = productList.map(async (product) => {
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

    res.status(200).json({ products, pages });
  } catch (err) {
    next(err);
  }
};

const posts = async (req, res, next) => {
  const { daysAgo, date } = req.query;

  const now = new Date();
  const today = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

  const formattedDate = date ? new Date(date) : new Date(today);
  const requestedDate = formattedDate.setDate(formattedDate.getDate() - daysAgo);
  const nextDate = formattedDate.setDate(formattedDate.getDate() + 1);

  const productList = await Product.find(
    {
      createdAt: {
        $gte: requestedDate,
        $lt: nextDate
      }
    },
    'name alias logo tagline createdAt website'
  )
    .sort({ createdAt: -1 })
    .populate('upvotes');

  const newProducts = productList.map(async (product) => {
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
};

const product = {
  create,
  get,
  updateCommons,
  updateLogo,
  updateCoverImage,
  remove,
  feed,
  posts
};

module.exports = product;
