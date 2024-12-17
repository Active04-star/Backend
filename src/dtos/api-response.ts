import { HttpStatus } from "@nestjs/common"
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum"

export class ApiResponse {

    @IsNotEmpty()
    @IsEnum(ApiStatusEnum)
    message: ApiStatusEnum;

    @IsOptional()
    @IsEnum(HttpStatus)
    status?: HttpStatus;
}