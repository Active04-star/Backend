import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { Subscription_Payment } from 'src/entities/subscriptionPayment.entity';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { Subscription_Repository } from './subscription.repository';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';

@Injectable()
export class Subscription_Service {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepostory: Subscription_Repository,
  ) {}

  async createSubscription(
    subscriptionPayment: Subscription_Payment,
    user: User,
  ):Promise<Subscription> {
    const subscriptionData = {
      status: SubscriptionStatus.ACTIVE,
      price: subscriptionPayment.amount.toNumber(),
      startDate: new Date(), // Fecha actual
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Un año después
      autoRenew: true,
      userId: user.id,
    };
    const created_subscription =
      await this.subscriptionRepostory.createSubscription(
        subscriptionData,
      );

    if (created_subscription === undefined) {
      throw new ApiError(
        ApiStatusEnum.SUBSCRIPTION_PAYMENT_FAILED,
        BadRequestException,
      );
    }

    return created_subscription;
  }
}
