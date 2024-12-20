import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('priceId') priceId: string,
    @Body('userId') userId: string,
  ):Promise<{ url: string }> {
    try {

       // Busca el usuario en tu base de datos
       const user = await this.userService.getUserById(userId);

         // Si el usuario no tiene un customerId, crea uno en Stripe
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await this.stripeService.createCustomer(user.id, user.email);
        console.log('customer creado',customer);
        
        customerId = customer.id;

        console.log("customer id",customerId)

        // Actualiza el usuario con el nuevo customerId
        const updatedUser=await this.userService.updateStripeCustomerId(user, customerId);
        if(!updatedUser.stripeCustomerId){
          throw new HttpException('No se pudo actualziar al usuario', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      const session = await this.stripeService.createCheckoutSession(
        priceId,
        customerId,
      );
     return { url: session.url };;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = 'whsec_qMrj7rQWJcuR1TGRFFDVzOIVrgLWmSeA';
    const rawBody = req.body; // Ya es raw debido al middleware
    console.log('Raw body:', typeof rawBody); // Verifica cómo luce el cuerpo del webhook
    console.log('Received signature:', signature); // Verifica la firma recibida

  
    try {
      // Verifica la firma del webhook
      const event = this.stripeService.verifyWebhook(
        rawBody,
        signature,
        webhookSecret,
      );
  
      // Procesa el evento según el tipo
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
  
        // Asegúrate de que session.customer sea un string antes de usarlo
        const customerId = session.customer;
  
        if (typeof customerId === 'string') {
          // Ahora podemos usarlo como string
          const user = await this.userService.getUserByStripeCustomerId(customerId);
  
          if (!user) {
            throw new Error('No se encontró el usuario con el customerId en la base de datos.');
          }
  
          // Aquí puedes continuar con la lógica de procesamiento del pago
          await this.stripeService.handleCheckoutSessionCompleted(session, user);
        } else {
          throw new Error('customerId no es un string, es de tipo: ' + typeof customerId);
        }
      }
  
      return 'Evento procesado';
    } catch (err) {
      console.error('Error procesando el webhook', err);
      return 'Error al procesar el webhook';
    }
  }


}
