import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Field } from './field.entity';
import { Payment } from './payment.entity';
import { Review } from './review.entity';
import { Payment_History } from './payment_hisotry.entity';
import { Field_Schedule } from './field_schedule.entity';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  /**esta en true para que sea null porque cuando se crea la reserva va a tener un estado de pending y al completarse el pago, la reserva va a apsar a completarse y tener un pago asociado ,esa fecha va a estar marcada como ocupada por un momente hasta quese complete el pago por un tiempo determinado*/
  @OneToOne(() => Payment, (payment) => payment.reservation, { nullable: true })
  @JoinColumn()
  payment: Payment;

  @OneToOne(() => Review, (review) => review.reservation, { cascade: true })
  @JoinColumn()
  review: Review;



  @ManyToOne(() => User, (user) => user.reservations, { nullable: false })
  user: User;

  @ManyToOne(() => Field, (field) => field.reservation, { nullable: false })
  field: Field;

  @ManyToOne(() => Field_Schedule, (schedule) => schedule.reservations, {
    nullable: false,
  })
  fieldSchedule: Field_Schedule;
}
