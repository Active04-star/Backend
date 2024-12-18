import { PartialType } from "@nestjs/swagger";
import { FieldDto } from "./createField.dto";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateFieldDto extends PartialType(FieldDto) {
    @IsUUID()
    @IsNotEmpty()
    id: string;
  }