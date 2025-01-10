import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";

console.log('servicio crons')
@Injectable()
export class ScheduleTaskService {
    constructor ( private readonly configService: ConfigService) {}


    @Cron('* * * * *')
    handleCron() {
        const enableSchedules = this.configService.get<boolean>('ENABLE_SCHEDULES', true);
        if(enableSchedules) {
            console.log('crons ejecutandose cada minuto')
        }else {

        }
    }

}