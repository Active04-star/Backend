import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class Payment_Repository{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository:Repository<Payment>
  ) {}



}
