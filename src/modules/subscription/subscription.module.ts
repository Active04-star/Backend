import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription_Service } from '../subscription/subscription.service';
import { Subscription } from 'src/entities/subscription.entity';
import { Subscription_Repository } from './subscription.repository';
import { Subscription_Controller } from './subscription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers:[Subscription_Controller],
  providers: [Subscription_Service, Subscription_Repository],
  exports: [Subscription_Service],
})
export class Subscription_Module {}
