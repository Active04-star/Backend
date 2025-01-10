import { PartialType } from "@nestjs/swagger";
import { FieldDto } from "./createField.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateFieldDto extends PartialType(FieldDto) {
  @IsOptional()
  @IsBoolean()
  isACtive: boolean;
}