import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { UserModule } from '../user/user.module';
import { Sport_Cateogry_Module } from '../sport-category/sport-category.module';
import { ImagesModule } from '../images/images.module';
import { UploadModule } from 'src/modules/uploads/upload.module';
import { SportCenter_Module } from '../sport-center/sport-center.module';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { SportCenter_Schedules_Controller } from './sportCenter_schedules.controller';
import { SportCenter_Schedule_Service } from './sportCenter_scheudle.service';

@Module({
  imports: [
    SportCenter_Module,
    TypeOrmModule.forFeature([SportCenter_Schedule]),
  ],
  controllers: [SportCenter_Schedules_Controller],
  providers: [SportCenter_Schedule_Service],
  exports: [],
})
export class SportCenter_Schedule_Module {}
