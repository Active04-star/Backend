import { OmitType } from "@nestjs/swagger";
import { User } from "src/entities/user.entity";

export class UserClean extends OmitType(User, ["password", "reservations", "reviews", "authtoken"] as const) { }