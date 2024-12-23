import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Payment_Service } from './payment.service';
import { Payment_Repository } from './payment.repository';
import { Payment_Controller } from './payment.controller';
import { Subscription_Payment } from 'src/entities/subscriptionPayment.entity';
import { Payment_History } from 'src/entities/payment_hisotry.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Payment,Subscription_Payment,Payment_History])],
  controllers: [Payment_Controller],
  providers: [ Payment_Service, Payment_Repository],
  exports: [Payment_Service],
})
export class Payment_Module {}
