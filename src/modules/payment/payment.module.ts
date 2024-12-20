import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Payment_Service } from './payment.service';
import { Payment_Repository } from './payment.repository';
import { Payment_Controller } from './payment.controller';
import { Subscription_Module } from '../subscription/subscription.module';
import { Subscription_Payment } from 'src/entities/subscriptionPayment.entity';

@Module({
  imports: [Subscription_Module, TypeOrmModule.forFeature([Payment,Subscription_Payment])],
  controllers: [Payment_Controller],
  providers: [ Payment_Service, Payment_Repository],
  exports: [Payment_Service],
})
export class Payment_Module {}
