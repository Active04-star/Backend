import { IsNotEmpty, IsString, IsUUID, IsNumber, Length, Min, Max } from "class-validator";

export class reviewCreate {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    @IsString()
    @Length(20, 100)
    comment: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reservationId: string
}