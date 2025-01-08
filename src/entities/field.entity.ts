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
import { Image } from './image.entity';
import Decimal from 'decimal.js';
import { Payment } from './payment.entity';
import { Review } from './review.entity';
import { Field_Block } from './field_blocks.entity';

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
  price: Decimal | null;

  // Duración de cada rango horario (por ejemplo, 1 hora por reserva)
  @Column({ type: 'int', nullable: false, default: 60 }) // Duración en minutos
  duration_minutes: number;

  @OneToMany(() => Reservation, (reservation) => reservation.field, {
    nullable: true,
  })
  reservation: Reservation[];

  @OneToMany(() => Payment, (payment) => payment.field)
  payments: Payment[];

  @OneToMany(() => Field_Block, (block) => block.field, { cascade: true })
  blocks: Field_Block[];

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
