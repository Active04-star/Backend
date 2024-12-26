import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Payment_Service } from "./payment.service";
import { Payment } from "src/entities/payment.entity";
import { createPaymentDto } from "src/dtos/payment/createPayment.dto";
import { AuthGuard } from "src/guards/auth-guard.guard";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";


@ApiTags("Payment")
@Controller('payment')
export class Payment_Controller{
    constructor(private readonly paymentService:Payment_Service){}


    @Post('create')
    @Roles(UserRole.USER)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Registra un nuevo pago',
      description: 'Crea un nuevo registro de Payment en el sistema.',
    })
    @ApiBody({ description: 'Datos necesarios para crear un nuevo Payment', type: createPaymentDto })
    async createSportCenter(@Body() data: createPaymentDto,): Promise<Payment> {
      return await this.paymentService.createPayment(data);
    }


    @Get('user/:userId')
    @Roles(UserRole.USER)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Obtiene los pagos de un usuario',
      description: 'Proporciona toda la información de los pagos',
    })
    @ApiParam({
      name: 'id',
      description: 'ID del usuario',
      example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
    })
    async getPayments(@Param('userId', ParseUUIDPipe) userId: string): Promise<Payment[]> {
      return await this.paymentService.getPayments(userId);
    }


    @Get(':id')
    @ApiOperation({
      summary: 'Obtiene un Pago por su ID',
      description: 'Proporciona toda la información de un pago.',
    })
    @ApiParam({
      name: 'id',
      description: 'ID del Payment que se desea obtener',
      example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
    })
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
      return await this.paymentService.getById(id);
    }

}
