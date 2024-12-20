import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
  import { User } from './user.entity';
import { Subscription_Payment } from './subscriptionPayment.entity';
  
  @Entity()
  export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'enum',
      enum: SubscriptionStatus,
      default: SubscriptionStatus.PENDING,
    })
    status: SubscriptionStatus;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;
  
    @Column({ type: 'timestamp', nullable: false })
    startDate: Date;
  
    @Column({ type: 'timestamp', nullable: false })
    endDate: Date;
  
    @Column({ default: true })
    autoRenew: boolean; // Si la suscripción se renueva automáticamente
  
    // Relación uno a uno con User
    @OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @OneToMany(() => Subscription_Payment, (payment) => payment.subscription)
    payments: Subscription_Payment[];
  }
  