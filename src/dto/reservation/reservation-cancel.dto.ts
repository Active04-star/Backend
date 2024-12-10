import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class reservationCancel {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reservationId: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 100)
    cancelReason: string
}