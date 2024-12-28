import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field } from './field.entity';
import { SportCenter_Schedule } from './sportcenter_schedules.entity';
import { Field_Block } from './field_blocks.entity';

@Entity({ name: 'field_schedule' })
export class Field_Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time', nullable: false })
  opening_time: string;

  @Column({ type: 'time', nullable: false })
  closing_time: string;

  // Duración de cada rango horario (por ejemplo, 1 hora por reserva)
  @Column({ type: 'int', nullable: false, default: 60 }) // Duración en minutos
  duration_minutes: number;

  
  @Column({ nullable: false,default:true })
  isOpen: boolean;

  @ManyToOne(() => Field, (field) => field.schedules, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  field: Field;

  @OneToMany(() => Field_Block, (fieldBlock) => fieldBlock.fieldSchedule, { cascade: true })
  blocks: Field_Block[];


  @ManyToOne(
    () => SportCenter_Schedule,
    (sportCenterSchedule) => sportCenterSchedule.fieldSchedules,
    { nullable: false, onDelete: 'CASCADE' },
  )
  sportcenter_schedule: SportCenter_Schedule;
}
