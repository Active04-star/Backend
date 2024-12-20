import Decimal from 'decimal.js';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class Subscription_Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: Decimal) => value.toNumber(),
      from: (value: string) => new Decimal(value),
    },
  })
  amount: Decimal;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.STRIPE,
  })
  paymentMethod: PaymentMethod;

  @Column({ default: false })
  isPaid: boolean;
  
  @ManyToOne(() => User, (user) => user.subscriptionPayments, { nullable: false })
  user: User;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments, { nullable: true })
  subscription: Subscription;

}
