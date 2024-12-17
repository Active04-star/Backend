import { OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, NotContains, ValidateNested } from "class-validator";
import { Type } from "@nestjs/class-transformer";
import { User } from "src/entities/user.entity";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";

export class LoginResponse {
    @IsNotEmpty()
    @IsString()
    message: ApiStatusEnum.LOGIN_SUCCESS | ApiStatusEnum.REGISTRATION_SUCCESS;

    @IsNotEmpty()
    @IsString()
    @NotContains(" ")
    token: string;

    @ValidateNested()
    @Type(() => InnerResponseInfo)
    user: InnerResponseInfo;
}

class InnerResponseInfo extends OmitType(User, ["managed_centers", "password", "reservations", "reviews", "payments", "managers_list", "paymentHistory"]) { }