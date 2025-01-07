import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import { CreateSportCenterScheduleDto } from "src/dtos/sportcenter_schedule.dto.ts/sportCenterSchedule.dto";
import { SportCenter_Schedule } from "src/entities/sportcenter_schedules.entity";
import { AuthGuard } from "src/guards/auth-guard.guard";
import { SportCenter_Schedule_Service } from "./sportCenter_scheudle.service";

@Controller()
export class SportCenter_Schedules_Controller{
    constructor(private readonly scheduleServie: SportCenter_Schedule_Service){}

    @Post('create/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Registra un nuevo centro deportivo',
    description: 'Crea un nuevo registro de SportCenter en el sistema.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo SportCenter',
    type: CreateSportCenterScheduleDto,
  })
  async createScheduel(@Body() data: CreateSportCenterScheduleDto,) {
    return await this.scheduleServie.createSchedule(data);
  }

    
}