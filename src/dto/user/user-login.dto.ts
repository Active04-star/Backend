import { PickType } from "@nestjs/swagger";
import { UserRegister } from "./user-register.dto";

export class UserLogin extends PickType(UserRegister, ["email", "password"] as const) { }