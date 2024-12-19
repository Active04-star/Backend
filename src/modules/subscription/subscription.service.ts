import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Subscription_Service {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepostory: Repository<Subscription>, 
  ) {}


  async createSubscription(){
    
  }
}
