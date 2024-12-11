import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from 'src/enums/roles.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { Review } from './review.entity';
import { SportCenter } from './sportcenter.entity';
import { Reservation } from './reservation.entity';

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
  password?: string;

  @Column({nullable: true})
  authtoken?: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.NOTHING,
  })
  subscription_status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: false, default: false })
  was_banned: boolean;

  @OneToMany(() => Review, (review) => review.user, { nullable: true })
  reviews: Review[];

  @OneToMany(() => SportCenter, (sportcenter) => sportcenter.manager, {
    nullable: true,
  })
  managed_centers: SportCenter[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    nullable: true,
  })
  reservations: Reservation[];
}
