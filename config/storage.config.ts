const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'daoradar',
    format: 'jpeg'
  }
});

const fileFilter = (req, file, cb) => {
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const ext = file.originalname.split('.').pop();
  if (!validExtensions.includes(ext)) {
    req.fileValidationError = 'Please, upload a valid image';
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

export default multer({ storage, fileFilter, limits: { fileSize: 10000000 } }); //10MB
