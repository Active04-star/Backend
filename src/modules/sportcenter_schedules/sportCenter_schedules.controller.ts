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

  @Post('create-or-update/:id')
  @Roles(UserRole.MAIN_MANAGER, UserRole.MANAGER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Crea o actualiza horarios del centro deportivo',
    description: 'Crea nuevos horarios o actualiza los existentes para un centro deportivo.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear o actualizar un SportCenter_Schedule',
    type: CreateSportCenterScheduleDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del SportCenter',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async createOrUpdateSchedule(
    @Body() data: CreateSportCenterScheduleDto[],
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<SportCenter_Schedule[]> {
    return await this.scheduleServie.createOrUpdateSchedule(data, id);
  }
}
