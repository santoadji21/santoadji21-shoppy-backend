import { CreateSessionRequestDto } from '@/features/checkout/dto/create-session.request';
import { ProductsService } from '@/features/products/products.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(productData: CreateSessionRequestDto) {
    const product = await this.productService.findOne(productData.productId);
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.getOrThrow('FRONTEND_URL')}/success`,
      cancel_url: `${this.configService.getOrThrow('FRONTEND_URL')}/cancel`,
    });
    return session;
  }

  findAll() {
    return `This action returns all checkout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkout`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkout`;
  }
}
