import { DataSource } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment_Repository } from './payment.repository';
import { User } from 'src/entities/user.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { createPaymentDto } from 'src/dtos/payment/createPayment.dto';
import { UserService } from '../user/user.service';
import { Payment } from 'src/entities/payment.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Payment_History } from 'src/entities/payment_hisotry.entity';
import { BlockStatus, Field_Block } from 'src/entities/field_blocks.entity';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentRepository: Payment_Repository,
    private userService: UserService,
  ) {}

  async getPayments(userId: string) {
    const user: User = await this.userService.getUserById(userId);

    const found_payments: Payment[] =
      await this.paymentRepository.getPayments(user);

    return found_payments;
  }

  async getById(id: string):Promise<Payment> {
    const found_payemnt: Payment | undefined =
      await this.paymentRepository.getById(id);

    if (found_payemnt === undefined) {
      throw new ApiError(ApiStatusEnum.PAYMENT_NOT_FOUND, NotFoundException);
    }

    return found_payemnt;
  }

  async createPayment(payment: createPaymentDto) {
    const { userId, fieldId, reservationId, ...paymentData } = payment;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Primero verificar si ya existe un pago para esta reserva
      const existingPayment = await manager.findOne(Payment, {
        where: { reservation: { id: reservationId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (existingPayment) {
        throw new ApiError(
          ApiStatusEnum.PAYMENT_ALREADY_EXISTS,
          BadRequestException,
          'A payment already exists for this reservation',
        );
      }

      // 2. Obtener y bloquear la reserva
      const reservation = await manager.findOne(Reservation, {
        where: { id: reservationId },
        relations: ['fieldBlock'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new ApiError(
          ApiStatusEnum.RESERVATION_NOT_FOUND,
          BadRequestException,
        );
      }

      // 3. Verificaciones de estado
      if (reservation.status !== ReservationStatus.PENDING) {
        throw new ApiError(
          ApiStatusEnum.INVALID_RESERVATION_STATUS,
          BadRequestException,
          'Reservation must be in PENDING state',
        );
      }

      const fieldBlock = reservation.fieldBlock;
      if (fieldBlock.status === BlockStatus.RESERVED) {
        throw new ApiError(
          ApiStatusEnum.FIELD_BLOCK_ALREADY_RESERVED,
          BadRequestException,
        );
      }

      // 4. Crear el pago
      const createdPayment = manager.create(Payment, {
        userId,
        fieldId,
        reservation,
        ...paymentData,
      });

      // 5. Actualizar estados
      reservation.status = ReservationStatus.COMPLETED;
      fieldBlock.status = BlockStatus.RESERVED;

      // 6. Guardar todo en orden
      await manager.save(Payment, createdPayment);
      await manager.save(Reservation, reservation);
      await manager.save(Field_Block, fieldBlock);

      // 7. Registrar historial de pago
      const paymentHistory = manager.create(Payment_History, {
        payment: createdPayment,
        status: PaymentStatus.COMPLETED,
        amount: paymentData.amount,
      });
      await manager.save(Payment_History, paymentHistory);

      return createdPayment;
    });
  }

  async createSubscriptionPayment(data: any, user: User) {
    const created_payment =
      await this.paymentRepository.createSUbscriptionPayment(data, user);

    if (created_payment === undefined) {
      throw new ApiError(
        ApiStatusEnum.SUBSCRIPTION_PAYMENT_FAILED,
        BadRequestException,
      );
    }

    return created_payment;
  }
}
