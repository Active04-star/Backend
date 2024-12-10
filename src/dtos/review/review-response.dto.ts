import { IsNotEmpty, IsString, IsUUID, IsNumber, Length, IsDate, Max, Min } from "class-validator";

export class reviewResponse {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reviewId: string;

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
    userId: string;
}