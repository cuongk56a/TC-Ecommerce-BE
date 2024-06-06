import { appConfigs } from "../../config/config";

export const TABLE_IMAGE = `${appConfigs.database.tablePrefix}_image`;

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import cloudinary from '../../config/cloudinary';

// Cấu hình lưu trữ Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Ecommerce',
      format: file.originalname.split('.').pop(), // supports file extension inference
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước tệp là 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg and .png format allowed!'));
    }
  },
});

export default upload;