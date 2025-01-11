import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateSportCenterScheduleDto } from 'src/dtos/sportcenter_schedule.dto.ts/sportCenterSchedule.dto';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { SportCenter_Schedule_Service } from './sportCenter_scheudle.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';

@ApiTags('horarios del centro')
@Controller('schedules')
export class SportCenter_Schedules_Controller {

  constructor(private readonly scheduleServie: SportCenter_Schedule_Service) { }

  @Post('create/:id')
  @Roles(UserRole.MAIN_MANAGER, UserRole.MANAGER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Registra horarios del centro deportivo',
    description: 'Crea una nueva tabla de horarios para un centro deportivo.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo SportCenter_Schedule',
    type: CreateSportCenterScheduleDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del SportCenter',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async createSchedule(@Body() data: CreateSportCenterScheduleDto[], @Param('id', ParseUUIDPipe) id: string): Promise<SportCenter_Schedule[]> {
    return await this.scheduleServie.createSchedule(data, id);
  }
}
