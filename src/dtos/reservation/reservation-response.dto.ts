import { IsNotEmpty, IsString, IsUUID, IsDate, IsEnum } from "class-validator";
import { ReservationStatus } from "src/enums/reservationStatus.enum";
export class reservationResponse {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reservationId: string;

    @IsNotEmpty()
    @IsEnum(ReservationStatus)
    status: ReservationStatus;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    sportCenterId: string;

    @IsNotEmpty()
    @IsDate()
    reservationDate: Date;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId: string
}
