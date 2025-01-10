import { Module } from "@nestjs/common";
import { ScheduleTaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";
import { Reservation_Repository } from "../reservation/reservation.repository";
import { Reservation_Module } from "../reservation/reservation.module";

@Module({
    imports: [ScheduleModule.forRoot(), Reservation_Module],
    providers: [ScheduleTaskService],
})

export class ScheduleTaskModule {}