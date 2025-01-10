import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Payment } from './payment.entity'; // Relación con la entidad Payment
import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import Decimal from 'decimal.js';

@Entity()
export class Payment_History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

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
  })
  status: PaymentStatus;

  // Relación OneToMany con Payment
  @OneToOne(() => Payment, (payment) => payment.history)
  payment: Payment;

}
