
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { SportCenter } from "./sportcenter.entity"

@Entity()
export class Photos {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    url: string

    @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.photos)
    sportcenter: SportCenter
}