import { IsNotEmpty, IsString, IsUUID, IsNumber, Length, Max, Min } from "class-validator";

export class reviewUpdate {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    reviewId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    updateRating: number;

    @IsNotEmpty()
    @IsString()
    @Length(20, 100)
    updateComment: string;
}