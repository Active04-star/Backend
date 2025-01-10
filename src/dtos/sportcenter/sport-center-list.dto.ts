import { Type } from "@nestjs/class-transformer";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";
import { SportCenterResponseDto } from "./sport-center-response.dto";

export class SportCenterList {
    @IsInt()
    @IsNotEmpty()
    items: number;

    @IsInt()
    @IsNotEmpty()
    page: number;

    @IsInt()
    @IsNotEmpty()
    limit: number;

    @IsInt()
    @IsNotEmpty()
    total_pages: number;

    @Type(() => SportCenterResponseDto)
    @IsNotEmpty()
    @IsArray()
    sport_centers: SportCenterResponseDto[];
}