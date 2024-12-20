import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { Subscription_Payment } from 'src/entities/subscriptionPayment.entity';
import { User } from 'src/entities/user.entity';
import { CreateSubscriptionDto } from 'src/dtos/subscription/createSubscription.dto';

@Injectable()
export class Subscription_Repository{
 
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository:Repository<Subscription>
  ) {}


  async createSubscription(data: CreateSubscriptionDto):Promise<Subscription|undefined> {
    const created_subscription:Subscription=await this.subscriptionRepository.save(this.subscriptionRepository.create(data))

    return created_subscription === null ? undefined : created_subscription;

  }


}
