import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminRepository } from "./admin.repository";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Reservation } from "src/entities/reservation.entity";
import { Sport_Center_Module } from "../sport-center/sport-center.module";

@Module({
    imports: [Sport_Center_Module,UserModule, TypeOrmModule.forFeature([User, SportCenter,Reservation])],
    controllers: [AdminController], 
    providers: [AdminService, AdminRepository], 
    exports: []
})
export class AdminModule {}