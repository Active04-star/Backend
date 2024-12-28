import { IsOptional, IsBoolean, IsInt, IsString, Min, MaxLength, Matches } from 'class-validator';

export class UpdateFieldScheduleDto {
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid opening time format. Use HH:mm' })
  opening_time?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid closing time format. Use HH:mm' })
  closing_time?: string;

  @IsOptional()
  @IsInt()
  @Min(15, { message: 'Duration must be at least 15 minutes.' })
  duration_minutes?: number;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
