import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { SportCenterController } from './sport-center.controller';
import { SportCenterService } from './sport-center.service';
import { SportCenterRepository } from './sport-center.repository';
import { UserModule } from '../user/user.module';
import { Sport_Cateogry_Module } from '../sport-category/sport-category.module';
import { ImagesModule } from '../images/images.module';
import { UploadModule } from 'src/modules/uploads/upload.module';
import { Review } from 'src/entities/review.entity';

@Module({
  imports: [forwardRef(() => ImagesModule), UploadModule, UserModule, forwardRef(() => Sport_Cateogry_Module), TypeOrmModule.forFeature([SportCenter,Review])],
  controllers: [SportCenterController],
  providers: [SportCenterService, SportCenterRepository],
  exports: [SportCenterService],
})
export class SportCenter_Module { }
