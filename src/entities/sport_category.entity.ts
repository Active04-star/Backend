import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { SportCenter } from './sportcenter.entity';

@Entity()
export class Sport_Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string; // URL del logo del deporte

  @OneToMany(() => Field, (field) => field.sportCategory, { nullable: true })
  field: Field[];

  @ManyToMany(() => SportCenter, (sportcenter) => sportcenter.sport_categories)
  sportcenters: SportCenter;
}
