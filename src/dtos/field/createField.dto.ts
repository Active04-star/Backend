import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  IsUUID,
  IsDecimal,
} from 'class-validator';

export class FieldDto {
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Numero de la cancha',
    example: 1,
  })
  number: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty({
    description: 'Precio de la cancha (¿por hora?)',
    example: '100.00',
  })
  price: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID de la categoria de deporte',
  })
  sportCategoryId?: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID del centro deportivo',
  })
  sportCenterId: string;
}
