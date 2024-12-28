import {  IsNotEmpty, IsNumber, IsString, IsUUID, Matches, Max, Min } from 'class-validator';

export class CreateFieldScheduleDto {
  @IsString()
  @Matches(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: 'opening_time must be in the format HH:mm',
  })
  @IsNotEmpty()
  opening_time: string;

  @IsString()
  @Matches(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: 'closing_time must be in the format HH:mm',
  })
  @IsNotEmpty()
  closing_time: string;

  @IsNumber()
  @Min(15, { message: 'duration_minutes must be at least 15 minutes' })
  @Max(240, { message: 'duration_minutes cannot exceed 240 minutes' })
  @IsNotEmpty()
  duration_minutes: number;



  @IsUUID()
  @IsNotEmpty()
  fieldId: string;

  @IsUUID()
  @IsNotEmpty()
  sportcenterScheduleId: string;
}