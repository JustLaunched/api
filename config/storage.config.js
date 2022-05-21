const setImageFolder = require('../utils/setImageFolder');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req) => setImageFolder(req.path),
    format: 'jpeg',
    public_id: async (req) => {
      const { alias, address } = req.params;
      const folder = await setImageFolder(req.path);
      return `${alias || address}_${folder}`;
    }
  }
});

const fileFilter = (req, file, callback) => {
  const validExtensions = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
  const ext = file.originalname.split('.').pop();
  if (!validExtensions.includes(ext)) {
    const message = 'Please, upload a valid image';
    return callback(null, false, message);
  }
  callback(null, true);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5000000 } }); // 5MB
