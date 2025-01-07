import { Injectable } from '@nestjs/common';
import { SportCenter_Schedule_Repository } from './sportCenter_scheudle.repository';
import { CreateSportCenterScheduleDto } from 'src/dtos/sportcenter_schedule.dto.ts/sportCenterSchedule.dto';

@Injectable()
export class SportCenter_Schedule_Service {
 
  constructor(private scheudleRepository: SportCenter_Schedule_Repository) {}


 async createSchedule(data: CreateSportCenterScheduleDto){
    throw new Error("Method not implemented.");
}
}
