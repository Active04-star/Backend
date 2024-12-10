import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field } from './field.entity';

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

  //NO VA AQUI
  // @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.sport_category, {
  //   nullable: false,
  // })
  // sportcenter: SportCenter;
}
