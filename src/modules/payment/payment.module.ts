import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Subscription_Service } from '../subscription/subscription.service';
import { Payment_Service } from './payment.service';
import { Payment_Repository } from './payment.repository';
import { Payment_Controller } from './payment.controller';
import { Subscription_Module } from '../subscription/subscription.module';

@Module({
  imports: [Subscription_Module, TypeOrmModule.forFeature([Payment])],
  controllers: [Payment_Controller],
  providers: [Subscription_Service, Payment_Service, Payment_Repository],
  exports: [],
})
export class Payment_Module {}
