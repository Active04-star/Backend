import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Reservation } from "src/entities/reservation.entity";
import { SportCenter_Module } from "../sport-center/sport-center.module";
import { AdminRepository } from "./admin.repository";
import { Auth0Module } from "../auth0/auth0.module";

@Module({
    imports: [Auth0Module, SportCenter_Module, UserModule, TypeOrmModule.forFeature([User, SportCenter, Reservation])],
    controllers: [AdminController],
    providers: [AdminService, AdminRepository],
    exports: [AdminService]
})
export class AdminModule { }