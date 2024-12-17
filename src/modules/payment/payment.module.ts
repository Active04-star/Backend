import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';

@Module({
  imports: [
    ,
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class Payment_Module {}
