
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { SportCenter } from "./sportcenter.entity"
import { Field } from "./field.entity"

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    image_url: string

    @ManyToOne(() => SportCenter, (sportcenter) => sportcenter.photos,{nullable:true})
    sportcenter: SportCenter

    @ManyToOne(() => Field, (field) => field.photos,{nullable:true})
    field: Field
    
   
}