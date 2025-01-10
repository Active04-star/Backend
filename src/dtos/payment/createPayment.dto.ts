import Decimal from "decimal.js";
import { PaymentMethod } from "src/enums/paymentMethod.enum";
import { IsNotEmpty, IsString, IsDecimal, IsEnum, IsUUID } from "class-validator";

export class createPaymentDto {
    @IsNotEmpty()
    @IsDecimal()
    amount: Decimal;
    
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
    
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    sportCenterId: string;

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
    reservationId: string;
}

