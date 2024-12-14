import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { SportCenterController } from './sport-center.controller';
import { SportCenterService } from './sport-center.service';
import { SportCenterRepository } from './sport-center.repository';
import { UserModule } from '../user/user.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([SportCenter, Image, User])],
  controllers: [SportCenterController],
  providers: [SportCenterService, SportCenterRepository],
  exports: [SportCenterService],
})
export class Sport_Center_Module {}
