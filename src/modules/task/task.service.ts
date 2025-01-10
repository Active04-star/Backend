import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Reservation_Repository } from "../reservation/reservation.repository";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { Repository } from "typeorm";

@Injectable()
export class ScheduleTaskService {
    constructor ( 
        private readonly configService: ConfigService,
        private readonly reservationRepository: Reservation_Repository
    ){}


    @Cron('* * * * *')
    async processReservations() {
        const enableSchedules = this.configService.get<string>('ENABLE_SCHEDULES', 'true') === 'true';
        if(enableSchedules) {
            console.log('ejecutando cron de reservas...')
            const reservationsNotify = await this.reservationRepository.getResevationCron();
            for (const reservation of reservationsNotify) {
                await this.reservationRepository.notifyUser(reservation)
                console.log(`notificando rserva ID: ${reservation.id}`)
            }
        }else {
            console.log("cron desactivado")
        }
    }

}