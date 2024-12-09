import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sport_Category } from "src/entities/sport_category.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Sport_Category])],
    controllers:[],
    providers:[],
    exports:[],
})
export class Sport_Cateogry_Module{}