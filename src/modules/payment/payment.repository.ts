import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import { Subscription_Payment } from 'src/entities/subscriptionPayment.entity';
import { Field } from 'src/entities/field.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { createPaymentDto } from 'src/dtos/payment/createPayment.dto';

@Injectable()
export class Payment_Repository {

  getById(id: string): Payment | PromiseLike<Payment> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription_Payment)
    private readonly subscriptionPayment: Repository<Subscription_Payment>,
   
  ) {}



 async  getPayments(user: User): Promise<Payment[]> {
  const payments:Payment[]=await this.paymentRepository.find({
    where:{
      user:{id:user.id}
    },
    relations: ['history', 'reservation', 'field', 'sportCenter'],
  })

  return payments
  }


  
  async createPayment(
    field: Field,
    user: User,
    reservation: Reservation,
    paymentData: Omit<
      createPaymentDto,
      'fieldId' | 'userId' | 'fieldId' | 'reservationId'
    >,
  ): Promise<Payment | undefined> {



    const saved_payment: Payment = await this.paymentRepository.save(
      this.paymentRepository.create({
        user,
        field,
        reservation,
        amount: 123,
        status: PaymentStatus.COMPLETED,
      }),
    );

    return saved_payment === null ? undefined : saved_payment;
  }

  async createSUbscriptionPayment(session: any, user: User) {
    const saved_payment: Subscription_Payment =
      await this.subscriptionPayment.save(
        this.subscriptionPayment.create({
          amount: 123,
          status: PaymentStatus.COMPLETED,
          isPaid: true,
          user: user,
          paymentMethod: PaymentMethod.STRIPE,
        }),
      );

    return saved_payment === null ? undefined : saved_payment;
  }
}
