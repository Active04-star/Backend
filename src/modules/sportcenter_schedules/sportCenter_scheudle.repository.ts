import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCenterScheduleDto } from 'src/dtos/sportcenter_schedule.dto.ts/sportCenterSchedule.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SportCenter_Schedule_Repository {
 
  constructor(
    @InjectRepository(SportCenter_Schedule) private centerScheduleRepository: Repository<SportCenter_Schedule>,
  ) { }


  async updateSchedules(
    schedules: CreateSportCenterScheduleDto[],
    sportcenter: SportCenter
  ): Promise<SportCenter_Schedule[]> {
    const updatedSchedules: SportCenter_Schedule[] = [];
  
    for (const scheduleDto of schedules) {
      const { day, isOpen, opening_time, closing_time } = scheduleDto;
  
      // Buscar el horario existente para ese día
      const existingSchedule = await this.centerScheduleRepository.findOne({
        where: { sportcenter, day },
      });
  
      if (existingSchedule) {
        // Actualizar campos del horario existente
        existingSchedule.isOpen = isOpen;
        existingSchedule.opening_time = opening_time;
        existingSchedule.closing_time = closing_time;
  
        const savedSchedule = await this.centerScheduleRepository.save(
          existingSchedule
        );
        updatedSchedules.push(savedSchedule);
      } else {
        // Si no existe un horario para ese día, crear uno nuevo
        const newSchedule = this.centerScheduleRepository.create({
          sportcenter,
          day,
          isOpen,
          opening_time,
          closing_time,
        });
  
        const savedSchedule = await this.centerScheduleRepository.save(
          newSchedule
        );
        updatedSchedules.push(savedSchedule);
      }
    }
  
    return updatedSchedules;
  }
  
  async createSchedules(schedules: CreateSportCenterScheduleDto[], sportcenter: SportCenter): Promise<SportCenter_Schedule[] | undefined> {
    const createdSchedules: SportCenter_Schedule[] = [];


    for (const scheduleDto of schedules) {
      const { day, isOpen, opening_time, closing_time } = scheduleDto;
      console.log('shceudledto', scheduleDto);

      const newSchedule = this.centerScheduleRepository.create({
        sportcenter,
        day,
        isOpen,
        opening_time,
        closing_time,
      });

      const savedSchedule = await this.centerScheduleRepository.save(newSchedule);
      createdSchedules.push(savedSchedule);
    }

    return createdSchedules.length === schedules.length ? createdSchedules : undefined

  }
}
