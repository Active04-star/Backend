import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import { Payment_Type } from 'src/enums/paymentType.enum';
import { Payment_History } from 'src/entities/payment_hisotry.entity';

@Injectable()
export class Payment_Repository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async createSUbscriptionPayment(session: any, user: User) {

  }
}
