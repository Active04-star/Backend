import { OmitType, PartialType } from "@nestjs/swagger";
import { LocalRegister } from "./local-register.dto";

export class UpdateUser extends PartialType(OmitType(LocalRegister, ["confirm_password", "email"])){}