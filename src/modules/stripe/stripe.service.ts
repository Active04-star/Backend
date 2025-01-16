import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly frontendUrl: string;

  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  async createCustomer(
    userId: string,
    email: string,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        userId, // Asocia el ID del usuario en tu base de datos
      },
    });
    return customer;
  }

  async createCheckoutSession(
    priceId: string,
    customerId: string,
  ): Promise<Stripe.Checkout.Session> {
    console.log('varibale', this.frontendUrl);

    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1, // Si es facturación medida, omite esta línea
          },
        ],
        success_url: `${this.frontendUrl}/manager`,
        cancel_url: `${this.frontendUrl}/canceled.html`,
      });
      return session;
    } catch (error) {
      throw new Error(`Error al crear la sesión de checkout: ${error.message}`);
    }
  }

  // Verificar la firma del webhook
  verifyWebhook(body: any, signature: string, webhookSecret: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new Error('Webhook signature verification failed');
    }
  }
}
