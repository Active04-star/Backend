import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Subscription_Service } from '../subscription/subscription.service';
import { Payment_Service } from './payment.service';
import { Payment_Repository } from './payment.repository';
import { Payment_Controller } from './payment.controller';
import { Subscription_Module } from '../subscription/subscription.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule,Subscription_Module, TypeOrmModule.forFeature([Payment])],
  controllers: [Payment_Controller],
  providers: [ Payment_Service, Payment_Repository],
  exports: [Payment_Service],
})
export class Payment_Module {}
