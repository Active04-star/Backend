import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
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
    description: 'Latitud del centro deportivo',
    example: 40.416775,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitud del centro deportivo',
    example: -3.70379,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'ID del usuario que va a crear el centro',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  manager: string;
}
