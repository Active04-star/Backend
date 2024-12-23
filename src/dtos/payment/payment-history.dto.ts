import { IsNotEmpty, IsString, IsDecimal, IsEnum, IsUUID, IsDate } from "class-validator";
import Decimal from "decimal.js";
import { PaymentStatus } from "src/enums/paymentStatus.enum";

export class paymentHistory {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    paymentId: string;

    @IsNotEmpty()
    @IsDecimal()
    amount: Decimal;

    @IsNotEmpty()
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @IsNotEmpty()
    @IsDate()
    paymentDate: Date
}

