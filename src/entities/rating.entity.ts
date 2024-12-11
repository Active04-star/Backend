import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SportCenter } from './sportcenter.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;  // Calificación del 1 al 5

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SportCenter)
  @JoinColumn({ name: 'sportCenterId' })
  sportCenter: SportCenter;
}
