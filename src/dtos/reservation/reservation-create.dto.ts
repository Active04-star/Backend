import { IsNotEmpty, IsString, IsUUID, IsDate, Matches, IsEnum } from "class-validator";
import { SportType } from "src/enums/sportType.enum";

export class reservationCreate {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    sportCenterId: string;

    @IsNotEmpty()
    @IsEnum(SportType)
    sportType: SportType;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    reservationDate: Date;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, {message: 'debe ser de formato HH:MM'})
    timeSlot: string
}