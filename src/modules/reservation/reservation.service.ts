import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Reservation_Repository } from "./reservation.repository";
import { ApiError } from "src/helpers/api-error-class";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { ReservationStatus } from "src/enums/reservationStatus.enum";
import { Reservation } from "src/entities/reservation.entity";
import { createReservationDto } from "src/dtos/reservation/reservation-create.dto";

@Injectable()
export class Reservation_Service {
    constructor(private readonly reservationRepository: Reservation_Repository) { }


    async createReservation(data:createReservationDto) {

    }

    async cancelReservation(id: string): Promise<boolean> {
        const reservation: Reservation | undefined = await this.reservationRepository.findById(id);

        if (reservation === undefined) {
            throw new ApiError(ApiStatusEnum.RESERVATION_NOT_FOUND, NotFoundException);
        }

        if (reservation.status === ReservationStatus.CANCELLED) {
            throw new ApiError(ApiStatusEnum.RESERVATION_ALREADY_CANCELED, BadRequestException);
        }

        const deleted: Reservation = await this.reservationRepository.cancelReservation(reservation);

        return deleted !== undefined;

    }
}

