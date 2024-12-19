import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';

@Injectable()
export class Subscription_Repository{
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository:Repository<Subscription>
  ) {}



}
