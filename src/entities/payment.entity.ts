import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import Decimal from 'decimal.js';
import { Field } from './field.entity';
import { SportCenter } from './sportcenter.entity';
import { User } from './user.entity';
import { Payment_History } from './payment_hisotry.entity';

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
    default: PaymentMethod.MERCADOPAGO,
  })
  paymentMethod: PaymentMethod;

  @OneToMany(()=>Payment_History,(history)=>history.payment)
  history:Payment_History

  // Relación con la cancha asociada al pago
  @ManyToOne(() => Field, (field) => field.payments, { nullable: false })
  field: Field;

  // Relación con el centro deportivo asociado al pago
  @ManyToOne(() => SportCenter, (sportCenter) => sportCenter.payments, {
    nullable: false,
  })
  sportCenter: SportCenter;

  @ManyToOne(() => User, (user) => user.payments, {
    nullable: false,
  })
  user: User;

  // Relación con la reserva asociada al pago
  @OneToOne(() => Reservation, (reservation) => reservation.payment, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  reservation: Reservation;
}
