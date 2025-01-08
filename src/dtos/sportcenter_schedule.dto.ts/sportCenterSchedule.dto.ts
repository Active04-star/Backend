import {
  IsEnum,
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { DayOfWeek } from 'src/enums/dayOfWeek.enum';

export class CreateSportCenterScheduleDto {
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @IsBoolean()
  isOpen: boolean;

  @IsOptional()
  @IsString()
  opening_time?: string;

  @IsOptional()
  @IsString()
  closing_time?: string;
}
