import { PickType } from "@nestjs/swagger";
import { LocalRegister } from "./local-register.dto";

export class UserLogin extends PickType(LocalRegister, ["email", "password"] as const) { }