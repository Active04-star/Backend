import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sport_Category } from './sport_category.entity';
import { SportCenter } from './sportcenter.entity';
import { Reservation } from './reservation.entity';
import { Field_Schedule } from './field_schedule.entity';
import { Image } from './image.entity';
import Decimal from 'decimal.js';
import { Payment } from './payment.entity';
import { Review } from './review.entity';
import { Payment_History } from './payment_hisotry.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isACtive: boolean;

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

  @OneToMany(() => Reservation, (reservation) => reservation.field, {
    nullable: true,
  })
  reservation: Reservation[];

  @OneToMany(() => Payment, (payment) => payment.field)
  payments: Payment[];

  @OneToMany(() => Payment_History, (history) => history.payment)
  paymentsHistory: Payment_History;

  @OneToMany(() => Field_Schedule, (fieldSchedule) => fieldSchedule.field, {
    cascade: true,
  })
  schedules: Field_Schedule[];

  @OneToMany(() => Image, (photos) => photos.field, { nullable: true })
  photos: Image[];

  @OneToMany(() => Review, (review) => review.sportcenter, { nullable: true })
  reviews: Review[];

  @ManyToOne(() => Sport_Category, (sportCategory) => sportCategory.field, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  sportCategory: Sport_Category;

  @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.fields, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  sportcenter: SportCenter;
}
