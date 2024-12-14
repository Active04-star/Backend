import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SportCenter } from "./sportcenter.entity";
import { User } from "./user.entity";

@Entity()
export class Sport_Center_Managers{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=>SportCenter,(sportcenter)=>sportcenter.managers_list,{nullable:true})
    sportCenter:SportCenter

    @ManyToMany(()=>User,(user)=>user.managers_list)
    @JoinTable({ name: 'user_managers_list' })
    managers:User[]
}
