import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Payment_Repository } from './payment.repository';
import { User } from 'src/entities/user.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { createPaymentDto } from 'src/dtos/payment/createPayment.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field_Service } from '../field/field.service';
import { Field } from 'src/entities/field.entity';
import { Payment } from 'src/entities/payment.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Payment_History } from 'src/entities/payment_hisotry.entity';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly paymentRepository: Payment_Repository,
    private userService: UserService,
    private fieldService: Field_Service,
    @InjectRepository(Reservation)
    private readonly reservation: Repository<Reservation>,
    @InjectRepository(Payment_History)
    private readonly paymentHistory: Repository<Payment_History>,
    @InjectRepository(Payment)
    private readonly payment_Repository: Repository<Payment>,
  ) {}




async getPayments(userId:string){
const user:User=await this.userService.getUserById(userId)


  const found_payments: Payment[] =
  await this.paymentRepository.getPayments(user);



return found_payments;
}


  async getById(id: string) {

    const found_payemnt: Payment | undefined =
      await this.paymentRepository.getById(id);

    if (found_payemnt === undefined) {
      throw new ApiError(ApiStatusEnum.PAYMENT_NOT_FOUND, NotFoundException);
    }

    return found_payemnt;
  }

  async createPayment(payment: createPaymentDto) {
    const { userId, fieldId, reservationId, ...paymentData } = payment;
    const user: User = await this.userService.getUserById(userId);
    const field: Field = await this.fieldService.findById(fieldId);
    const reservation = await this.reservation.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new ApiError(
        ApiStatusEnum.RESERVATION_NOT_FOUND,
        BadRequestException,
      );
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new ApiError(
        ApiStatusEnum.INVALID_RESERVATION_STATUS,
        BadRequestException,
        'Reservation must be in a PENDING state to proceed with payment.',
      );
    }

    const created_payment: Payment | undefined =
      await this.paymentRepository.createPayment(
        field,
        user,
        reservation,
        paymentData,
      );

    if (created_payment === undefined) {
      throw new ApiError(
        ApiStatusEnum.PAYMENT_CREATION_FAILED,
        BadRequestException,
      );
    }

    const history = this.paymentHistory.create({
      amount: paymentData.amount,
      status: PaymentStatus.COMPLETED,
      payment: created_payment,
    });

    const savedHistory = await this.paymentHistory.save(history);

    created_payment.history = savedHistory;
    const updatedPayment = await this.payment_Repository.save(created_payment);

    reservation.status = ReservationStatus.ACTIVE;
    await this.reservation.save(reservation);

    return updatedPayment;
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
