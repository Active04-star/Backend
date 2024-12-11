import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryService } from '../../src/config/cloudinary.config';

@Module({
  controllers: [UploadController],
  providers: [UploadService, CloudinaryService],
})
export class UploadModule {}
