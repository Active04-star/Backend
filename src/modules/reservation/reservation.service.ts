import { Injectable } from "@nestjs/common";
import { Reservation_Repository } from "./reservation.repository";

@Injectable()
export class Reservation_Service {
    constructor(private readonly reservationRepository:Reservation_Repository){}


    async createReservation(){
    
    }
}

