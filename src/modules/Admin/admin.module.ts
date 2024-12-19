import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminRepository } from "./admin.repository";
import { SportCenter } from "src/entities/sportcenter.entity";

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([User, SportCenter])],
    controllers: [AdminController], 
    providers: [AdminService, AdminRepository], //reservationRepository,
    exports: []
})
export class AdminModule {}