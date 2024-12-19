import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription_Service } from '../subscription/subscription.service';
import { Subscription } from 'src/entities/subscription.entity';
import { Subscription_Repository } from './subscription.repository';

@Module({
  imports: [
    ,
    TypeOrmModule.forFeature([Subscription]),
  ],
  providers: [Subscription_Service,Subscription_Repository],
  exports: [Subscription_Service],
})
export class Subscription_Module {}
