import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateSportCategoryDto {

    @ApiProperty({ description: "nombre de la categoria", example: "Paddle" })
    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    name: string;

    @ApiProperty({ description: "foto de la categoria (QUEDA COMO EXTRA)", example: "" })
    @IsOptional()
    @IsString()
    logo?: string;

}