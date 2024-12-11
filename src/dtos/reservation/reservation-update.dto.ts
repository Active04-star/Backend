import { IsNotEmpty, IsString, IsUUID, IsDate, Matches } from "class-validator";

export class reservationUpdate {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reservationId: string;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    newDate: Date;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, {message: 'debe ser de formato HH:MM'})
    newTime: string
}
