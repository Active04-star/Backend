import { IsNotEmpty, Min, Max, IsInt, IsUUID, IsEnum } from 'class-validator';

export class FieldDto {
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  @IsUUID()
  sportCategoryId: string;

  @IsNotEmpty()
  @IsUUID()
  sportCenterId: string;
}
