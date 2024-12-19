import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'El ID del precio de la suscripción',
    example: 'price_1JxykR2eZvKYlo2C1LdbZbs7',
  })
  @IsString()
  priceId: string;
}
