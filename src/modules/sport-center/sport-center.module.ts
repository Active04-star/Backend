import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SportCenter } from "src/entities/sportcenter.entity";
import { SportCenterController } from "./sport-center.controller";
import { SportCenterService } from "./sport-center.service";
import { SportCenterRepository } from "./sport-center.repository";

@Module({
    imports:[TypeOrmModule.forFeature([SportCenter])],
    controllers:[SportCenterController],
    providers:[SportCenterService,SportCenterRepository],
    exports:[],
})
export class Sport_Center_Module{}