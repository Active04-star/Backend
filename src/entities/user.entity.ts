import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Reservation } from './reservation.entity';
import { UserRole } from 'src/enums/roles.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { AccountType } from 'src/enums/accountType.enum';
import { Review } from './review.entity';
import { SportCenter } from './sportcenter.entity';
import { Reservation } from './reservation.entity';
// import { Review } from './review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ unique: true, length: 50, nullable: false })
  email: string;

  @Column({
    default:
      'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux',
  })
  profile_image: string;

  @Column({ length: 128, nullable: true })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.NOTHING,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSUMER,
  })
  role: UserRole;

  @Column({ nullable: false, default: false })
  isBanned: boolean;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.LOCAL,
  })
  account_type: AccountType;

  @OneToMany(() => Review, (review) => review.user, { nullable: true })
  reviews: Review[];

  @OneToMany(() => SportCenter, (sportcenter) => sportcenter.manager, {
    nullable: true,
  })
  managedSportCenters: SportCenter[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    nullable: true,
  })
  reservations: Reservation[];
}
