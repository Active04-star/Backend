import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
  } from 'typeorm';
  import { Payment } from './payment.entity'; // Relación con la entidad Payment
  import { User } from './user.entity'; // Relación con la entidad User
  import { PaymentStatus } from 'src/enums/paymentStatus.enum';
import Decimal from 'decimal.js';
import { Reservation } from './reservation.entity';
import { Field } from './field.entity';
import { SportCenter } from './sportcenter.entity';
  
  @Entity()
  export class Payment_History {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
  
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
      amount: Decimal;
    
    @Column({
      type: 'enum',
      enum: PaymentStatus,
    })
    status: PaymentStatus; 
  
    @ManyToOne(() => Payment, (payment) => payment.history, { nullable: false })
    @JoinColumn()
    payment: Payment; // Relación con el pago al que pertenece el historial
  
    @ManyToOne(() => User, (user) => user.paymentHistory, { nullable: false })
    @JoinColumn()
    user: User; 
    
    @ManyToOne(() => SportCenter, (sportCenter) => sportCenter.paymentsHistory, {
        nullable: true,
      })
      sportCenter: SportCenter;
    
      // Relación con la cancha asociada al pago
      @ManyToOne(() => Field, (field) => field.paymentsHistory, { nullable: true })
      field: Field;
    
      // Relación con la reserva asociada al pago
      @OneToOne(() => Reservation, (reservation) => reservation.paymentsHistory, {
        nullable: true,
        cascade: true,
      })
      @JoinColumn()
      reservation: Reservation;// Relación con el usuario que realizó el pago
  }
  