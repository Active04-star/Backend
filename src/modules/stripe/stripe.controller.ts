import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';


@ApiTags("Stripe")
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService,private configService:ConfigService) {}





  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Crear una sesión de checkout para suscripciones' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        priceId: {
          type: 'string',
          description: 'El ID del precio de la suscripción',
          example: 'price_1JxykR2eZvKYlo2C1LdbZbs7',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión creada exitosamente.',
    schema: {
      example: {
        sessionUrl: 'https://checkout.stripe.com/pay/cs_test_a1b2c3d4',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error al crear la sesión.',
  })
  async createCheckoutSession(@Body() body: { priceId: string }) {
    try {
      const session = await this.stripeService.createCheckoutSession(body.priceId);
      return session;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  



  @Post('webhook')
  async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string, @Res() res: Response) {
    const webhookSecret = 'whsec_qMrj7rQWJcuR1TGRFFDVzOIVrgLWmSeA'
    const rawBody = JSON.stringify(body);
    console.log('Raw body:', rawBody);  // Verifica cómo luce el cuerpo del webhook
    console.log('Received signature:', signature);  // Verifica la firma recibida

    try {
      // Verifica la firma del webhook

      
      const event = this.stripeService.verifyWebhook(rawBody, signature, webhookSecret);

      // Procesa el evento según el tipo
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;  
        const status = session.status;
        console.log(`Subscription status is ${status}.`);
        await this.stripeService.handleCheckoutSessionCompleted(session);
      }

      return 'Evento procesado'
    } catch (err) {
      console.error('Error procesando el webhook', err);
      return 'Error al procesar el webhook'
    }
  }


  

//   @Delete(':subscriptionId')
//   async cancelSubscription(@Param('subscriptionId') subscriptionId: string) {
//     if (!subscriptionId) {
//       throw new HttpException(
//         'subscriptionId es requerido',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     try {
//       const canceledSubscription =
//         await this.stripeService.cancelSubscription(subscriptionId);
//       return { canceledSubscription };
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
}
