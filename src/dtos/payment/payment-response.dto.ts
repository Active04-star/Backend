import { IsNotEmpty, IsString, IsEnum, IsUUID, IsDate } from "class-validator";
import { PaymentStatus } from "src/enums/paymentStatus.enum";
export class paymentResponse {

    @IsNotEmpty()
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    transactionId: string;

    @IsNotEmpty()
    @IsDate()
    paymentDate: Date;
}
