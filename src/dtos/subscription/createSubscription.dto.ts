import { IsEnum, IsNotEmpty, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsBoolean()
  autoRenew: boolean;

  @IsNotEmpty()
  userId: string; // Relación con el usuario
}
