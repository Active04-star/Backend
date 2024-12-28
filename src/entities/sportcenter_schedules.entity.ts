import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SportCenter } from './sportcenter.entity';
import { DayOfWeek } from 'src/enums/dayOfWeek.enum';
import { Field_Schedule } from './field_schedule.entity';

@Entity({ name: 'sportcenter_schedules' })
export class SportCenter_Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: false,
  })
  day: DayOfWeek;

  @Column({ nullable: false,default:true })
  isOpen: boolean;

  @Column({ type: 'time', nullable: false })
  opening_time: string;

  @Column({ type: 'time', nullable: false })
  closing_time: string;

  @OneToMany(
    () => Field_Schedule,
    (fieldSchedule) => fieldSchedule.sportcenter_schedule,
  )
  fieldSchedules: Field_Schedule[];

  @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.schedules, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  sportcenter: SportCenter;
}
