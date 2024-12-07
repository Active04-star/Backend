import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import Decimal from 'decimal.js';

@Entity()
export class Payment {
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
  price: Decimal;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.MERCADOPAGO,
  })
  paymentMethod: PaymentMethod;

  @OneToOne(() => Reservation, (reservation) => reservation.payment)
  reservation: Reservation;
}
