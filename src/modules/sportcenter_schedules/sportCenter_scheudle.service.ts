import { BadRequestException, Injectable } from '@nestjs/common';
import { SportCenter_Schedule_Repository } from './sportCenter_scheudle.repository';
import { CreateSportCenterScheduleDto } from 'src/dtos/sportcenter_schedule.dto.ts/sportCenterSchedule.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SportCenter_Schedule_Service {
  constructor(
    private scheduleRepository:SportCenter_Schedule_Repository,
    @InjectRepository(SportCenter)
    private centerRepository: Repository<SportCenter>,  ) {}

  async createSchedule(data: CreateSportCenterScheduleDto[], id: string):Promise<SportCenter_Schedule[]> {

    console.log('data',data);
    
    const sportcenter: SportCenter = await this.centerRepository.findOne({
      where:{main_manager:{id:id}},
      relations:['schedules']
    })

    if (sportcenter.schedules.length > 0) {
      throw new ApiError(
        ApiStatusEnum.CENTER_ALREADY_HAS_SCHEDULES,
        BadRequestException,
      );
    }

    const created_schedules: SportCenter_Schedule[] | undefined =
      await this.scheduleRepository.createSchedules(data,sportcenter);

        if (created_schedules === undefined) {
            throw new ApiError(ApiStatusEnum.CENTER_SCHEDULES_CREATION_FAILED, BadRequestException);
          }

          return created_schedules
  }
}
