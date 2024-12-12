import { Injectable } from '@nestjs/common';
import cloudinary from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'ActiveProject' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); // Devuelve la URL segura del archivo subido
          }
        },
      );

      // Envía el buffer del archivo para que se suba
      stream.end(file.buffer);
    });
  }
}
