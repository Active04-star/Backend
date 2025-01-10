import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Field } from './field.entity';

export enum BlockStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

@Entity()
export class Field_Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  start_time: string; // Hora de inicio del bloque

  @Column({ type: 'time' })
  end_time: string; // Hora de fin del bloque

  @Column({ type: 'enum', enum: BlockStatus, default: BlockStatus.AVAILABLE })
  status: BlockStatus; // Estado del bloque: disponible o reservado

  @ManyToOne(() => Field, (field) => field.blocks, {
    onDelete: 'CASCADE',
  })
  field: Field;

  @OneToOne(() => Reservation, (reservation) => reservation.fieldBlock, { cascade: true, nullable: true })
  reservation: Reservation;
}