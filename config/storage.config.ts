import { setImageFolder } from './../utils/setImageFolder';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import type { Options } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req: any) => setImageFolder(req.path),
    format: 'jpeg',
    public_id: async (req: any) => {
      const { alias, username } = req.params;
      const folder = await setImageFolder(req.path);
      return `${alias || username}_${folder}`;
    }
  }
} as Options);

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, validFile: boolean, message?: string) => void
) => {
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const ext = file.originalname.split('.').pop();
  if (!validExtensions.includes(ext)) {
    const message = 'Please, upload a valid image';
    return callback(null, false, message);
  }
  callback(null, true);
};

export default multer({ storage, fileFilter, limits: { fileSize: 10000000 } }); // 10MB
