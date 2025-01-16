import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Reservation_Repository } from "../reservation/reservation.repository";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class ScheduleTaskService {
    constructor ( 
        private readonly configService: ConfigService,
        private readonly reservationRepository: Reservation_Repository
    ){}

    private isCronStatus(): boolean {
        return this.configService.get<string>('ENABLE_SCHEDULES', 'true') === 'true';
    }

    @Cron('30 * * * * *')
    async processReservations() {
        if(this.isCronStatus()) {
            console.log('ejecutando cron de reservas...')       //console.log() para test
            const reservationsNotify = await this.reservationRepository.getResevationCron();
            for (const reservation of reservationsNotify) {
                await this.reservationRepository.notifyUser(reservation)
                console.log(`notificando reserva ID: ${reservation.id}`) //console.log() para test
            }
        }else {
            console.log("cron de reservas desactivado")
        }
    }

    @Cron('0 * * * * *')
    async processNewReservation() {
        if(this.isCronStatus()){
            console.log('ejecutando cron de nuevas reservas...')       //console.log() para test
            const newReservation = await this.reservationRepository.reservationnotify();
            for(const reservation of newReservation) {
                await this.reservationRepository.notifyreservationUser(reservation)
                console.log(`Notificando al usuario que su reserva fue confirmada`) //console.log() para test
            }
        }else{
            console.log("crons de nuevas reservas desactivado") //console.log() para test
        }
    }
    

}