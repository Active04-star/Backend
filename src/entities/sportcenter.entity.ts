import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { User } from './user.entity';
import { Field } from './field.entity';
import { Image } from './image.entity';
import { Sport_Category } from './sport_category.entity';
import { SportCenter_Schedule } from './sportcenter_schedules.entity';
import { Payment } from './payment.entity';
import { Sport_Center_Managers } from './sport_center_managers.entity';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';

@Entity()
export class SportCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ length: 120 })
  address: string;

  @Column({ 
    type: 'float',
    default: 0
  })
  averageRating: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({
    type: 'enum',
    enum: Sport_Center_Status,
    default: Sport_Center_Status.DRAFT,
  })
  status: Sport_Center_Status;

  @OneToMany(() => Review, (review) => review.sportcenter, { nullable: true })
  reviews: Review[];

  @OneToMany(() => Image, (photos) => photos.sportcenter, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  photos: Image[];

  @OneToMany(() => Payment, (payment) => payment.field)
  payments: Payment[];

  @OneToMany(() => SportCenter_Schedule, (schedule) => schedule.sportcenter, {
    cascade: true,
  })
  schedules: SportCenter_Schedule[];

  @OneToMany(() => Field, (field) => field.sportcenter, {
    cascade: true,
  })
  fields: Field[];

  @OneToMany(() => Sport_Center_Managers, (manager) => manager.sportCenter, {
    nullable: true,
  })
  managers_list: Sport_Center_Managers[];

  @ManyToOne(() => User, (user) => user.managed_centers, {
    nullable: false, cascade: ["update", "remove"]
  })
  main_manager: User;

  @ManyToMany(
    () => Sport_Category,
    (sportCategory) => sportCategory.sportcenters,
    { nullable: true },
  )
  @JoinTable()
  sport_categories: Sport_Category[];
}
