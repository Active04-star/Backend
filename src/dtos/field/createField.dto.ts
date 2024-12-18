import {
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  IsUUID,
  IsOptional,
  IsDecimal,
} from 'class-validator';

export class FieldDto {
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  @IsDecimal()
  price: string;

  @IsUUID()
  @IsNotEmpty()
  sportCategoryId?: string;

  @IsNotEmpty()
  @IsUUID()
  sportCenterId: string;
}
