import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field_Block } from 'src/entities/field_blocks.entity';
import { Field_Schedule } from 'src/entities/field_schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Field_Schedule_Service {
  constructor(
    @InjectRepository(Field_Schedule)
    private fieldScheduleRepository: Repository<Field_Schedule>,
    @InjectRepository(Field_Block)
    private fieldBlockRepository: Repository<Field_Block>,
  ) {}

  async create(){
    
  }
}
