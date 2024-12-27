import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { Reservation_Controller } from "./reservation.controller";
import { Reservation_Service } from "./reservation.service";
import { Reservation_Repository } from "./reservation.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Reservation])],
    controllers: [Reservation_Controller], 
    providers: [Reservation_Service,Reservation_Repository],
    exports: [Reservation_Service]
})
export class Reservation_Module {}