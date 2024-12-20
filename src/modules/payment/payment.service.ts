import { Injectable } from '@nestjs/common';
import { Subscription_Service } from '../subscription/subscription.service';
import { Payment_Repository } from './payment.repository';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { Payment } from 'src/entities/payment.entity';

@Injectable()
export class Payment_Service {
  constructor(
    private readonly subscriptionService: Subscription_Service, 
    private readonly paymentRepository:Payment_Repository,
    private readonly userService: UserService,
  ) {}



  async findById(id:string){

  }
  async createSubscriptionPayment(data:any,user:User){
const created_payment=await this.paymentRepository.createSUbscriptionPayment(data,user)
  }
}
