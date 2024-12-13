import { FieldStatus } from 'src/enums/fieldStatus.enum';
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
import { Review } from './review.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column({
    type: 'enum',
    enum: FieldStatus,
    default: FieldStatus.AVAILABLE,
  })
  status: FieldStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.field, {
    nullable: true,
  })
  reservation: Reservation[];

  @ManyToOne(() => Sport_Category, (sportCategory) => sportCategory.field, {
    onDelete: 'CASCADE',
  })
  sportCategory: Sport_Category;

  @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.field, {
    onDelete: 'CASCADE',
  })
  sportcenter: SportCenter;

    // Relación uno a muchos con Review
    @OneToMany(() => Review, (review) => review.field)
    reviews: Review[];
}
