import { Type } from "@nestjs/class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { User } from "src/entities/user.entity";

export class UserList {
    @IsNumber()
    @IsNotEmpty()
    items: number;

    @IsNumber()
    @IsNotEmpty()
    page: number;

    @IsNumber()
    @IsNotEmpty()
    limit: number;

    @IsNumber()
    @IsNotEmpty()
    total_pages: number;

    @Type(() => User)
    @IsArray()
    users: User[];
}