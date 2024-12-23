import { BadRequestException, Injectable } from '@nestjs/common';
import { Payment_Repository } from './payment.repository';
import { User } from 'src/entities/user.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { createPaymentDto } from 'src/dtos/payment/createPayment.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment_History } from 'src/entities/payment_hisotry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly paymentRepository: Payment_Repository,
    private userService:UserService,
    @InjectRepository(Payment_History)
    private readonly paymentHistory:Repository<Payment_History>
  ) {}

  async getyId(id: string) {}




async createPayment(payment:createPaymentDto){
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

    return created_payment
  }
}
