import Decimal from "decimal.js";
import { PaymentMethod } from "src/enums/paymentMethod.enum";
import { IsNotEmpty, IsString, IsDecimal, IsEnum, IsUUID } from "class-validator";

export class paymentRequest {
    @IsNotEmpty()
    @IsDecimal()
    price: Decimal;
    
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
    reservationId: string
}

