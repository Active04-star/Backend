import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SportCenter } from './sportcenter.entity';
import { DayOfWeek } from 'src/enums/dayOfWeek.enum';
import { Field } from './field.entity';
import { SportCenter_Schedule } from './sportcenter_schedules.entity';
import { FieldStatus } from 'src/enums/fieldStatus.enum';

@Entity({ name: 'field_schedule' })
export class Field_Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Column({ type: 'time', nullable: false })
  end_time: string;

  // Duración de cada rango horario (por ejemplo, 1 hora por reserva)
  @Column({ type: 'int', nullable: false, default: 60 }) // Duración en minutos
  duration_minutes: number;

  @Column({
    type: 'enum',
    enum: FieldStatus,
    default: FieldStatus.AVAILABLE,
  })
  status: FieldStatus;

  @ManyToOne(() => Field, (field) => field.schedules, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  field: Field;

  @ManyToOne(
    () => SportCenter_Schedule,
    (sportCenterSchedule) => sportCenterSchedule.fieldSchedules,
    { nullable: false, onDelete: 'CASCADE' },
  )
  sportcenter_schedule: SportCenter_Schedule;
}
