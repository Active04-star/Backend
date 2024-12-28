import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Field_Schedule_Service } from './field_schedule.service';
import { Field_Schedule } from 'src/entities/field_schedule.entity';
import { CreateFieldScheduleDto } from 'src/dtos/field_scheudle/createFieldSchedule.dto';

@ApiTags('Field Schedules')
@Controller('field-schedule')
export class Field_Schedule_Controller {
  constructor(private readonly fieldScheduleService: Field_Schedule_Service) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea un nuevo field schedule' })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo SportCenter',
    type: CreateFieldScheduleDto,
  })
  async createFieldSchedule(
    @Body() data: CreateFieldScheduleDto,
  ): Promise<Field_Schedule> {
    return await this.fieldScheduleService.createFieldSchedule(data);
  }
}
