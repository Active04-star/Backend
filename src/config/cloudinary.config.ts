import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: './env' });

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

export default cloudinary;
