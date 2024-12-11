import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { User } from './user.entity';
import { Field } from './field.entity';
import { Photos } from './photos.entity';
import { SportCenterStatus } from 'src/enums/sportCenterStatus.enum';
import { Sport_Category } from './sport_category.entity';

@Entity()
export class SportCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ length: 120 })
  address: string;

  @Column({
    type: 'enum',
    enum: SportCenterStatus,
    default: SportCenterStatus.DRAFT,
  })
  status: SportCenterStatus;

  @OneToMany(() => Review, (review) => review.sportcenter, { nullable: true })
  reviews: Review[];

  @OneToMany(() => Field, (field) => field.sportcenter, { nullable: true })
  field: Field[];

  @OneToMany(
    () => Sport_Category,
    (sportCategory) => sportCategory.sportcenter,
    { nullable: true },
  )
  sport_category: Sport_Category[];

  @OneToMany(() => Photos, (photos) => photos.sportcenter, { nullable: true })
  photos: Photos[];

  @ManyToOne(() => User, (user) => user.managed_centers, {
    nullable: false,
  })
  manager: User;
}
