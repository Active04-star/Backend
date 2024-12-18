import { Type } from "@nestjs/class-transformer";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";
import { SportCenter } from "src/entities/sportcenter.entity";

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

    @Type(() => SportCenter)
    @IsNotEmpty()
    @IsArray()
    sport_centers: SportCenter[];
}