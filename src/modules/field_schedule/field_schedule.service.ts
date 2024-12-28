import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFieldScheduleDto } from 'src/dtos/field_scheudle/createFieldSchedule.dto';
import { Field } from 'src/entities/field.entity';
import { Field_Block } from 'src/entities/field_blocks.entity';
import { Field_Schedule } from 'src/entities/field_schedule.entity';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { validateFieldSchedule } from 'src/utils/field_schedule.utils';
import { Repository } from 'typeorm';
import { Field_Service } from '../field/field.service';

@Injectable()
export class Field_Schedule_Service {
  constructor(
    @InjectRepository(Field_Schedule)
    private fieldScheduleRepository: Repository<Field_Schedule>,
    @InjectRepository(Field_Block)
    private fieldBlockRepository: Repository<Field_Block>,
    @InjectRepository(SportCenter_Schedule)
    private sportCenterSchedule: Repository<SportCenter_Schedule>,
    private readonly fieldService: Field_Service,
  ) {}

  async createFieldSchedule(data: CreateFieldScheduleDto) {
    const { fieldId, sportcenterScheduleId, ...fieldScheduleData } = data;
    const sportCenterSchedule: SportCenter_Schedule =
      await this.sportCenterSchedule.findOne({
        where: { id: sportcenterScheduleId },
      });

    if (!sportCenterSchedule) {
      throw new Error('SportCenter Schedule not found');
    }

    const field: Field = await this.fieldService.findById(fieldId);

    if (!validateFieldSchedule(data, sportCenterSchedule)) {
      throw new ApiError(
        ApiStatusEnum.FIELD_SCHEUDLE_VALIDATION_FAILED,
        BadRequestException,
      );
    }

    const fieldSchedule = this.fieldScheduleRepository.create({
      ...fieldScheduleData,
      sportcenter_schedule: sportCenterSchedule,
      field: field,
    });

    const savedFieldSchedule =
      await this.fieldScheduleRepository.save(fieldSchedule);

    // Crear los bloques de horario basados en la duración
    await this.createFieldBlocks(savedFieldSchedule);

    return savedFieldSchedule;
  }

  private async createFieldBlocks(fieldSchedule: Field_Schedule) {
    const { opening_time, closing_time, duration_minutes } = fieldSchedule;

    const opening = this.timeStringToMinutes(opening_time);
    const closing = this.timeStringToMinutes(closing_time);

    if (closing <= opening || duration_minutes <= 0) {
      throw new Error('Invalid schedule or duration.');
    }

    const blocks: Field_Block[] = [];
    for (let start = opening; start < closing; start += duration_minutes) {
      const end = Math.min(start + duration_minutes, closing);

      const block = this.fieldBlockRepository.create({
        start_time: this.minutesToTimeString(start),
        end_time: this.minutesToTimeString(end),
        fieldSchedule,
      });

      blocks.push(block);
    }

    await this.fieldBlockRepository.save(blocks);
  }

  private timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  async updateFieldSchedule() {}

  async deleteFieldSchedule() {}

  async getFieldSchedules() {}
}
