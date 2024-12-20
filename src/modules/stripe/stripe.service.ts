import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string,private configService:ConfigService) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-11-20.acacia', 
    });
  }


  async createCustomer(userId: string, email: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        userId, // Asocia el ID del usuario en tu base de datos
      },
    });
    return customer;
  }

  async createCheckoutSession(
    priceId: string,customerId:string
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer:customerId,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1, // Si es facturación medida, omite esta línea
          },
        ],
        success_url:
          `http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/example.com/canceled.html`,
      });
      return session;
    } catch (error) {
      throw new Error(`Error al crear la sesión de checkout: ${error.message}`);
    }
  }


  // Verificar la firma del webhook
  verifyWebhook(body: any, signature: string, webhookSecret: string) {
    try {
      return this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      throw new Error('Webhook signature verification failed');
    }
  }

  // Manejar el evento de sesión completada
  async handleCheckoutSessionCompleted(session: any,userId:string) {
    // Aquí puedes actualizar tu base de datos para indicar que el pago fue exitoso
    console.log('Pago completado:', session);
  }




}

