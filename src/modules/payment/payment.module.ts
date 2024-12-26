import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Payment_Service } from './payment.service';
import { Payment_Repository } from './payment.repository';
import { Payment_Controller } from './payment.controller';
import { Subscription_Payment } from 'src/entities/subscriptionPayment.entity';
import { Payment_History } from 'src/entities/payment_hisotry.entity';
import { UserModule } from '../user/user.module';
import { Field_Module } from '../field/field.module';
import { Reservation } from 'src/entities/reservation.entity';

@Module({
  imports: [Field_Module, UserModule,TypeOrmModule.forFeature([Payment,Subscription_Payment,Payment_History,Reservation])],
  controllers: [Payment_Controller],
  providers: [ Payment_Service, Payment_Repository],
  exports: [Payment_Service],
})
export class Payment_Module {}
