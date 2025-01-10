import { Type } from "@nestjs/class-transformer";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";
import { Reservation } from "src/entities/reservation.entity";


export class ReservationList {
    @IsInt()
    @IsNotEmpty()
    items: number;

    @IsInt()
    @IsNotEmpty()
    page: number;

    @IsInt()
    @IsNotEmpty()
    limit: number;

    @IsInt()
    @IsNotEmpty()
    total_pages: number;

    @Type(() => Reservation)
    @IsArray()
    reservations: Reservation[];
}