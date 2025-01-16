import { DataSource, Repository } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reservation_Repository } from './reservation.repository';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Reservation } from 'src/entities/reservation.entity';
import { BlockStatus, Field_Block } from 'src/entities/field_blocks.entity';
import { Field_Service } from '../field/field.service';
import { UserService } from '../user/user.service';
import { isEmpty } from 'class-validator';
import { CreateReservationDto } from 'src/dtos/reservation/reservation-create.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class Reservation_Service {
  constructor(
    private readonly dataSource: DataSource,
    private readonly reservationRepository: Reservation_Repository,
    @Inject(forwardRef(() => Field_Service))
    private readonly field_service: Field_Service,
    private readonly userService: UserService,
    @InjectRepository(Field_Block)
    private fieldBlockRepository: Repository<Field_Block>,
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
  ) {}

  async createReservation(
    data: CreateReservationDto,
  ): Promise<{ message: string; reservation: Reservation }> {
    const { fieldBlockId, fieldId, userId, ...reservationData } = data;

    return await this.dataSource.transaction(async (manager) => {
      // Obtener el bloque con bloqueo pesimista
      const field_block = await manager.findOne(Field_Block, {
        where: { id: fieldBlockId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!field_block) {
        throw new ApiError(
          ApiStatusEnum.FIELD_BLOCK_NOT_FOUND,
          BadRequestException,
        );
      }

      if (field_block.status === BlockStatus.RESERVED) {
        throw new ApiError(
          ApiStatusEnum.FIELD_BLOCK_ALREADY_RESERVED,
          BadRequestException,
        );
      }

      // Obtener las demás entidades necesarias
      const user = await this.userService.getUserById(userId);
      const field = await this.field_service.findById(fieldId);

      // Crear la reservación
      const reservation = manager.create(Reservation, {
        field,
        fieldBlock: field_block,
        user,
        status: ReservationStatus.ACTIVE,
        ...reservationData,
      });

      field_block.status = BlockStatus.RESERVED;
      await manager.save(Field_Block, field_block);

      // Guardar la reservación
      const created_reservation = await manager.save(reservation);

      if (!created_reservation) {
        throw new ApiError(
          ApiStatusEnum.CENTER_CREATION_FAILED,
          BadRequestException,
        );
      }

      return {
        message: 'Reservación creada exitosamente',
        reservation: created_reservation,
      };
    });
  }

  async cancelReservation(id: string): Promise<Reservation> {
    const reservation: Reservation | undefined =
      await this.reservationRepository.findById(id);

    if (reservation === undefined) {
      throw new ApiError(
        ApiStatusEnum.RESERVATION_NOT_FOUND,
        NotFoundException,
      );
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new ApiError(
        ApiStatusEnum.RESERVATION_ALREADY_CANCELED,
        BadRequestException,
      );
    }

    reservation.status = ReservationStatus.CANCELLED;

    if (reservation.fieldBlock && reservation.field) {
      const block: Field_Block | undefined =
        await this.fieldBlockRepository.findOne({
          where: { id: reservation.fieldBlock.id },
          relations: ['reservation'], // Asegurarse de cargar la relación
        });

      if (block) {
        // Cambiar el estado del bloque a AVAILABLE
        block.status = BlockStatus.AVAILABLE;

        // Eliminar la relación entre el bloque y la reserva
        block.reservation = null;

        // Guardar los cambios en el bloque
        await this.fieldBlockRepository.save(block);
      }

      // También eliminar la relación desde el lado de la reserva
      reservation.fieldBlock = null;
      reservation.field = null;
    } else {
      throw new ApiError(
        ApiStatusEnum.
        RESERVATION_DOES_NOT_HAVE_BLOCKS_AND_FIELD,
        NotFoundException,
      );
    }
    return await this.reservationRepo.save(reservation);
  }

  async completeReservation(id: string): Promise<Reservation> {
    const reservation: Reservation | undefined =
      await this.reservationRepository.findById(id);

    if (reservation === undefined) {
      throw new ApiError(
        ApiStatusEnum.RESERVATION_NOT_FOUND,
        NotFoundException,
      );
    }
    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new ApiError(
        ApiStatusEnum.RESERVATION_ALREADY_COMPLETED,
        BadRequestException,
      );
    }
    const completedReservation: Reservation =
      await this.reservationRepository.completeReservation(reservation);

    return completedReservation;
  }

  async getReservationUser(id: string): Promise<Reservation[]> {
    const getReservation: Reservation[] =
      await this.reservationRepository.getReservationByUser(id);

    if (getReservation.length === 0) {
      throw new ApiError(
        ApiStatusEnum.RESERVATION_NOT_FOUND,
        NotFoundException,
      );
    }

    return getReservation;
  }

  async getReservationById(id: string): Promise<Reservation> {
    const foundReservation =
      await this.reservationRepository.getReservationById(id);

    if (isEmpty(foundReservation)) {
      throw new ApiError(ApiStatusEnum.RESERVATION_NOT_FOUND);
    }
    return foundReservation;
  }
}
