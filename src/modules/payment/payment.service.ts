import { Injectable } from '@nestjs/common';
import { Subscription_Service } from '../subscription/subscription.service';
import { Payment_Repository } from './payment.repository';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly subscriptionService: Subscription_Service, 
    private readonly paymentRepository:Payment_Repository
  ) {}
}
