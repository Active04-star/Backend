import { Injectable, InternalServerErrorException } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config';
import { ApiError } from 'src/helpers/api-error-class';

@Injectable()
export class UploadService {

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    console.log(file);

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'ActiveProject' },
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

  async removeFromCloudinary(url: string): Promise<boolean> {

    try {
      const slash = url.lastIndexOf('.');
      const dot = url.lastIndexOf("/");
      const second_dot = url.lastIndexOf("/", dot - 1);

      const sliced = url.slice(second_dot + 1, slash);

      const result = await cloudinary.uploader.destroy(sliced, { invalidate: true });

      console.log(sliced);

      if (result.result === 'ok') {
        return true;

      } else {
        console.log('No se pudo eliminar la imagen:', result.result);
        // throw new ApiError(ApiStatusEnum.IMAGE_DELETION_FAILED, InternalServerErrorException, result.result);
      }

    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }

  }
}
