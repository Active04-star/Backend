import { PartialType, PickType } from "@nestjs/swagger";
import { LocalRegister } from "./local-register.dto";

export class UpdateUser extends PartialType(PickType(LocalRegister, ["name"])) { }