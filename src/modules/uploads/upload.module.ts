import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryService } from 'src/config/cloudinary.config';

@Module({
  providers: [UploadService, CloudinaryService],
  exports: [UploadService]
})
export class UploadModule { }
