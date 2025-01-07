import { DataSource } from 'typeorm';
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
import { createReservationDto } from 'src/dtos/reservation/reservation-create.dto';
import { BlockStatus, Field_Block } from 'src/entities/field_blocks.entity';
import { Field_Service } from '../field/field.service';
import { UserService } from '../user/user.service';
import { isEmpty } from 'class-validator';
import { reservationResponse } from 'src/dtos/reservation/reservation-response.dto';

@Injectable()
export class Reservation_Service {
  constructor(
    private readonly dataSource: DataSource,
    private readonly reservationRepository: Reservation_Repository,
    @Inject(forwardRef(() => Field_Service))
    private field_service:Field_Service,
    private userService:UserService
  ) {}

  async createReservation(data: createReservationDto): Promise<{message: string}> {
    const { fieldBlockId, fieldId, userId, ...reservationData } = data;

    return await this.dataSource.transaction(async (manager) => {
        // Obtener el bloque con bloqueo pesimista
        const field_block = await manager.findOne(Field_Block, {
            where: { id: fieldBlockId },
            lock: { mode: 'pessimistic_write' }
        });

        if (!field_block) {
            throw new ApiError(
                ApiStatusEnum.FIELD_BLOCK_NOT_FOUND,
                BadRequestException
            );
        }

        if (field_block.status === BlockStatus.RESERVED) {
            throw new ApiError(
                ApiStatusEnum.FIELD_BLOCK_ALREADY_RESERVED,
                BadRequestException
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
            ...reservationData
        });

        field_block.status = BlockStatus.RESERVED;
        await manager.save(Field_Block, field_block);

        // Guardar la reservación
        const created_reservation = await manager.save(reservation);

        if (!created_reservation) {
            throw new ApiError(
                ApiStatusEnum.CENTER_CREATION_FAILED,
                BadRequestException
            );
        }

        return {
            message: "Reservación creada exitosamente",
            reservation:created_reservation
        };
    });
}

  async cancelReservation(id: string): Promise<boolean> {
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

    const deleted: Reservation =
      await this.reservationRepository.cancelReservation(reservation);

    return deleted !== undefined;
  }


  async getReservationUser(id: string): Promise<Reservation[]> {
    const getReservation = await this.reservationRepository.getReservationByUser(id)
     
    if(isEmpty(getReservation)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND);
    }

    return getReservation
  }

  async getReservationById(id: string): Promise<Reservation> {
    const foundReservation = await this.reservationRepository.getReservationById(id)

    if(isEmpty(foundReservation)) {
      throw new ApiError(ApiStatusEnum.RESERVATION_NOT_FOUND);
    }
    return foundReservation
  }
  }