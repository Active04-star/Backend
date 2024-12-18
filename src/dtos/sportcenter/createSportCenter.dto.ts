import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

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
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  manager: string;

  @ApiProperty({
    description: 'Imagenes Max. 5 (Debe ser un Array de Array buffer) (Nota: Swagger lo marca como obligatorio pero no lo es)',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
      maximum: 5,
    },
  })
  @ArrayMaxSize(5)
  @IsOptional()
  images: any[];

}
