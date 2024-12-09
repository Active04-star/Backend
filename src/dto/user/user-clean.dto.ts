import { PickType } from "@nestjs/swagger";
import { User } from "src/entities/user.entity";

export class UserClean extends PickType(User, ["password", "reservations", "reviews"] as const) { }