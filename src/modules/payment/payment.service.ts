import { Injectable } from '@nestjs/common';
import { Subscription_Service } from '../subscription/subscription.service';
import { Payment_Repository } from './payment.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly subscriptionService: Subscription_Service, 
    private readonly paymentRepository:Payment_Repository,
    private readonly userService: UserService,
  ) {}



  async findById(id:string){

  }
  async createSubscriptionPayment(userId:string){

  }
}
