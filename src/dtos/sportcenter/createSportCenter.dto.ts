import { Type } from '@nestjs/class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateSportCenterDto {
  @ApiProperty({
    description: 'Nombre del centro deportivo',
    example: 'Nombre del centro',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  @ApiProperty({
    description: 'Dirección del centro deportivo',
    example: '123 Street boulevard',
  })
  @IsNotEmpty()
  @Length(5, 30)
  address: string;

  @ApiProperty({
    description: 'ID del usuario que va a crear el centro',
    example: 'id-del-usuario',
  })
  @IsUUID()
  @IsNotEmpty()
  manager: string;

  @ApiPropertyOptional({
    description: 'Array de fotos del centro deportivo',
    type: [String],
    example: ['photo1.jpg', 'photo2.jpg'],
  })
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];
}
