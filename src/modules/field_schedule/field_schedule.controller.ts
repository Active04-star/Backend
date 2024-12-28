import {
    Body,
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiTags,
  } from '@nestjs/swagger';
import { Field_Schedule_Service } from './field_schedule.service';

  
  @ApiTags('Field Schedules')
  @Controller('field-schedule')
  export class Field_Schedule_Controller {
    constructor(private readonly fieldScheudleService: Field_Schedule_Service) {}




}