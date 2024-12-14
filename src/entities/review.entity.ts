import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { SportCenter } from './sportcenter.entity';
import { Reservation } from './reservation.entity';
import { Field } from './field.entity';

//la reseña es flexible

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number | null;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToOne(() => Reservation, (reservation) => reservation.review, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  reservation: Reservation;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.reviews, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  sportcenter: SportCenter;

  @ManyToOne(() => Field, (field) => field.reviews, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  field: Field;

  // Este hook se ejecuta antes de que la entidad se actualice
  @BeforeUpdate()
  setUpdateFields() {
    this.isEdited = true; // Marca como editado
    this.updatedAt = new Date(); // Registra la fecha de edición
  }
}
