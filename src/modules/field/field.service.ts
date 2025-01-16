import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Field_Repository } from './field.repository';
import { SportCenterService } from '../sport-center/sport-center.service';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Field } from 'src/entities/field.entity';
import { FieldDto } from 'src/dtos/field/createField.dto';
import { Sport_Category_Service } from '../sport-category/sport-category.service';
import { UpdateFieldDto } from 'src/dtos/field/updateField.dto';
import { Reservation_Service } from '../reservation/reservation.service';
import { ApiResponse } from 'src/dtos/api-response';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { Field_Block_Service } from '../field_blocks/field_schedule.service';
import { BlockStatus, Field_Block } from 'src/entities/field_blocks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Between, Repository } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class Field_Service {
  constructor(
    private readonly fieldRepository: Field_Repository,
    private sportCenterService: SportCenterService,
    private sportCategoryService: Sport_Category_Service,
    @Inject(forwardRef(() => Reservation_Service))
    private reservationService: Reservation_Service,
    @Inject(forwardRef(() => Field_Block_Service))
    private fieldblockService: Field_Block_Service,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async getAvailableBlocks(
    fieldId: string,
    date: Date,
  ): Promise<Field_Block[]> {
    const field = await this.fieldRepository.findById(fieldId);

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    const reservations = await this.reservationRepository.find({
      where: {
        field: { id: fieldId },
        date: Between(startOfDay(date), endOfDay(date)),
      },
      relations: ['fieldBlock'],
    });

    const reservedBlockIds = reservations
      .filter((res) => res.fieldBlock !== null)
      .map((res) => res.fieldBlock.id);

    return field.blocks.map((block) => ({
      ...block,
      status: reservedBlockIds.includes(block.id)
        ? BlockStatus.RESERVED
        : BlockStatus.AVAILABLE,
    }));
  }
  async updateField(id: string, data: UpdateFieldDto): Promise<Field> {
    const field = await this.fieldRepository.findById(id);
    const updatedField = await this.fieldRepository.updateField(field, data);
    return updatedField;
  }

  async createField(fieldData: FieldDto): Promise<Field> {
    try {
      const sportCenter: SportCenter = await this.sportCenterService.getById(
        fieldData.sportCenterId,
        true,
      );

      // Verificar si ya existe un campo con el mismo número
      const existingField = sportCenter.fields.find(
        (field) => field.number === fieldData.number && !field.isDeleted,
      );

      if (existingField) {
        throw new ApiError(
          ApiStatusEnum.FIELD_NUMBER_ALREADY_EXISTS,
          BadRequestException,
        );
      }
      const sportCategory: Sport_Category | null = fieldData.sportCategoryId
        ? await this.sportCategoryService.findById(fieldData.sportCategoryId)
        : null;

      if (!sportCenter.schedules.length) {
        throw new ApiError(
          ApiStatusEnum.SPORTCENTER_NEEDS_SCHEDULES_BEFORE,
          InternalServerErrorException,
        );
      }
      const created_field: Field | undefined =
        await this.fieldRepository.createField(
          sportCenter,
          sportCategory,
          fieldData,
        );

      if (created_field === undefined) {
        throw new ApiError(
          ApiStatusEnum.FIELD_CREATION_FAILED,
          InternalServerErrorException,
        );
      }

      for (const schedule of sportCenter.schedules) {
        const blocks = await this.fieldblockService.createFieldBlocks(
          created_field,
          schedule,
        );

        if (!blocks || blocks.length === 0) {
          throw new ApiError(
            ApiStatusEnum.FIELD_BLOCK_CREATION_FAILED,
            InternalServerErrorException,
          );
        }
      }

      return await this.findById(created_field.id);
    } catch (error) {
      throw new ApiError(error?.message, BadRequestException, error);
    }
  }

  async findById(id: string): Promise<Field> {
    const found_field: Field | undefined =
      await this.fieldRepository.findById(id);

    if (found_field === undefined) {
      throw new ApiError(ApiStatusEnum.FIELD_NOT_FOUND, NotFoundException);
    }

    return found_field;
  }

  async getFields(centerId: string): Promise<Field[]> {
    try {
      const found_center: SportCenter = await this.sportCenterService.getById(
        centerId,
        true,
      );

      if (
        found_center.fields === undefined ||
        found_center.fields.length === 0
      ) {
        throw new ApiError(
          ApiStatusEnum.CENTER_HAS_NO_FIELDS,
          NotFoundException,
        );
      }

      return await this.fieldRepository.getFields(found_center.id);
    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);
    }
  }

  async deleteField(id: string): Promise<Field> {
    try {
      const field: Field = await this.findById(id);

      console.log('holaaaaaaa', field);

      // Actualizar el estado de todas las reservas asociadas a 'CANCELED'
      if (field.reservation && field.reservation.length > 0) {
        console.log('holaa');

        await Promise.all(
          field.reservation.map(async (reservation) => {
            return await this.reservationService.cancelReservation(
              reservation.id,
            );
          }),
        );
      }

      if (field.reservation.length > 0) {
        throw new ApiError(
          ApiStatusEnum.CANT_CANCEL_RESERVATIONS,
          InternalServerErrorException,
        );
      }

      console.log('se va a elimianr ');

      //TODO Se tiene que enviar un mail aca avisando a los usuarios de la cancelacion
      const deletion_result: Field | undefined =
        await this.fieldRepository.deleteField(field);

      if (!deletion_result) {
        throw new ApiError(
          ApiStatusEnum.FIELD_DELETION_FAILED,
          InternalServerErrorException,
        );
      }

      return deletion_result;
    } catch (error) {
      console.log('erro', error);

      throw new ApiError(error?.message, BadRequestException, error);
    }
  }
}
