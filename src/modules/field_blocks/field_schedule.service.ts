import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field_Block } from 'src/entities/field_blocks.entity';
import { SportCenter_Schedule } from 'src/entities/sportcenter_schedules.entity';
import { Repository } from 'typeorm';
import { Field } from 'src/entities/field.entity';
import { Field_Service } from '../field/field.service';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';

@Injectable()
export class Field_Block_Service {

  constructor(
    @InjectRepository(Field_Block) private fieldBlockRepository: Repository<Field_Block>,
    @Inject(forwardRef(() => Field_Service)) private readonly fieldService: Field_Service,
  ) { }


  async getFiedlBlocks(fieldId: string) {
    const field: Field = await this.fieldService.findById(fieldId);
    return field.blocks;
  }


  async getById(id: string): Promise<Field_Block> {
    const fieldBlock: Field_Block | undefined = await this.fieldBlockRepository.findOneBy({ id });

    if (!fieldBlock) {
      throw new ApiError(ApiStatusEnum.FIELD_BLOCK_NOT_FOUND, NotFoundException);
    }

    return fieldBlock;
  }


  async createFieldBlocks(field: Field, sportCenterSchedule: SportCenter_Schedule) {
    const { duration_minutes } = field;
    const { opening_time, closing_time } = sportCenterSchedule;

    const opening = this.timeStringToMinutes(opening_time);
    const closing = this.timeStringToMinutes(closing_time);

    if (closing <= opening) {
      throw new Error('Invalid schedule.');
    } else if (duration_minutes <= 0) {
      throw new Error('Invalid duration.');
    }

    const blocks: Field_Block[] = [];
    for (let start = opening; start < closing; start += duration_minutes) {
      const end = Math.min(start + duration_minutes, closing);

      const block = this.fieldBlockRepository.create({
        start_time: this.minutesToTimeString(start),
        end_time: this.minutesToTimeString(end),
        field,
      });

      blocks.push(block);
    }

    const saved_blocks: Field_Block[] = await this.fieldBlockRepository.save(blocks);

    return saved_blocks === null ? undefined : saved_blocks;

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

}
