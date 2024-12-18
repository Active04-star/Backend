import { Type } from "@nestjs/class-transformer";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";
import { User } from "src/entities/user.entity";

export class UserList {
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

    @Type(() => User)
    @IsArray()
    users: User[];
}