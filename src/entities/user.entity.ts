import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from 'src/enums/roles.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { Review } from './review.entity';
import { SportCenter } from './sportcenter.entity';
import { Reservation } from './reservation.entity';
import { Payment } from './payment.entity';
import { Sport_Center_Managers } from './sport_center_managers.entity';
import { Subscription } from './subscription.entity';
import { Subscription_Payment } from './subscriptionPayment.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ unique: true, length: 50, nullable: false })
  email: string;

  @Column({ default: null })
  stripeCustomerId: string

  @Column({
    default:
      'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux',
  })
  profile_image: string;

  @Column({ length: 128, nullable: true })
  password?: string;

  @Column({ nullable: true, unique: true })
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

  @OneToMany(() => Subscription_Payment, (payment) => payment.user, { nullable: true })
  subscriptionPayments: Subscription_Payment[];

  @OneToOne(() => Subscription, (subscription) => subscription.user, { nullable: true })
  subscription: Subscription;

  @OneToMany(() => Payment, (payment) => payment.field, { nullable: true })
  payments: Payment[];


  @OneToMany(() => Review, (review) => review.user, { nullable: true })
  reviews: Review[];

  @OneToMany(() => SportCenter, (sportcenter) => sportcenter.main_manager, {
    nullable: true,
  })
  managed_centers: SportCenter[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    nullable: true, cascade: true
  })
  reservations: Reservation[];

  @ManyToMany(
    () => Sport_Center_Managers,
    (Usermanagers) => Usermanagers.managers,
    {
      nullable: true,
    },
  )
  managers_list: Sport_Center_Managers[];
}

