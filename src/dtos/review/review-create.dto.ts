import { IsNotEmpty, IsString, IsUUID, IsNumber, Length, Min, Max } from "class-validator";

export class reviewCreate {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    comment: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    fieldId: string

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId: string
}