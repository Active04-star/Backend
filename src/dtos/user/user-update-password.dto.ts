import { PickType } from "@nestjs/swagger";
import { LocalRegister } from "./local-register.dto";

export class UserUpdatePasswordDto extends PickType(LocalRegister, ["password", "confirm_password"]) { }