import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';

export class createReservationDto {
  @IsNotEmpty()
  @IsString()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  fieldId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  fieldBlockId: string;
}
