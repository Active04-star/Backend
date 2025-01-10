import { Module } from "@nestjs/common";
import { ScheduleTaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [ScheduleTaskService],
})

export class ScheduleTaskModule {}