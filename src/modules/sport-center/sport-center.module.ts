import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { SportCenterController } from './sport-center.controller';
import { SportCenterService } from './sport-center.service';
import { SportCenterRepository } from './sport-center.repository';
import { UserModule } from '../user/user.module';
import { User } from 'src/entities/user.entity';
import { Image } from 'src/entities/image.entity';
import { Sport_Cateogry_Module } from '../sport-category/sport-category.module';

@Module({
  imports: [
    forwardRef(() => Sport_Cateogry_Module),
    UserModule,
    TypeOrmModule.forFeature([SportCenter, Image, User]),
  ],
  controllers: [SportCenterController],
  providers: [SportCenterService, SportCenterRepository],
  exports: [SportCenterService],
})
export class Sport_Center_Module {}
