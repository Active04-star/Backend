import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Sport_Center_Status } from "src/enums/sport_Center_Status.enum";

export class UpdateStatusDto {
    @ApiProperty({ example: Sport_Center_Status.BANNED })
    @IsNotEmpty()
    @IsEnum(Sport_Center_Status)
    status: Sport_Center_Status;
}