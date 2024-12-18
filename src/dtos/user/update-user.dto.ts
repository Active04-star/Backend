import { OmitType, PartialType } from "@nestjs/swagger";
import { LocalRegister } from "./local-register.dto";
import { IsOptional, IsUrl } from "class-validator";

export class UpdateUser extends PartialType(OmitType(LocalRegister, ["confirm_password", "email"])) {

    @IsUrl()
    @IsOptional()
    profile_image?: string;
}