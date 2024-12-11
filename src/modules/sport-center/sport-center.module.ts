import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SportCenter } from "src/entities/sportcenter.entity";
import { SportCenterController } from "./sport-center.controller";
import { SportCenterService } from "./sport-center.service";
import { SportCenterRepository } from "./sport-center.repository";
import { Photos } from "src/entities/photos.entity";
import { UserModule } from "../user/user.module";

@Module({
    imports:[UserModule,TypeOrmModule.forFeature([SportCenter,Photos])],
    controllers:[SportCenterController],
    providers:[SportCenterService,SportCenterRepository],
    exports:[],
})
export class Sport_Center_Module{}