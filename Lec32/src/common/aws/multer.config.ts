import { UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const imageUploadOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (req, file, callback) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(
      new UnsupportedMediaTypeException(
        'Only JPEG, PNG, and WEBP images are allowed',
      ),
      false,
    );
  },
};
