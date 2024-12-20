import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscription_Service } from '../subscription/subscription.service';
import { Payment_Repository } from './payment.repository';
import { User } from 'src/entities/user.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly subscriptionService: Subscription_Service,
    private readonly paymentRepository: Payment_Repository,
  ) {}

  async findById(id: string) {}
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
