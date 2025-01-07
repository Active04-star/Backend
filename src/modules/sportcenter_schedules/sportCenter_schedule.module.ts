import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter_Module } from '../sport-center/sport-center.module';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { SportCenter_Schedules_Controller } from './sportCenter_schedules.controller';
import { SportCenter_Schedule_Service } from './sportCenter_scheudle.service';
import { SportCenter_Schedule_Repository } from './sportCenter_scheudle.repository';

@Module({
  imports: [
    SportCenter_Module,
    TypeOrmModule.forFeature([SportCenter_Schedule]),
  ],
  controllers: [SportCenter_Schedules_Controller],
  providers: [SportCenter_Schedule_Service,SportCenter_Schedule_Repository],
  exports: [],
})
export class SportCenter_Schedule_Module {}
