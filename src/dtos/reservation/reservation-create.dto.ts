import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';

export class CreateReservationDto {

  @ApiProperty({example: new Date()})
  @IsNotEmpty()
  @IsString()
  @IsDate()
  date: Date;

  @ApiProperty({example: "uuid"})
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({example: "uuid"})
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  fieldId: string;

  @ApiProperty({example: "uuid"})
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  fieldBlockId: string;
}
