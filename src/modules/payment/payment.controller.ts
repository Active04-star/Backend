import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("Payment")
@Controller('payment')
export class Payment_Controller{}
