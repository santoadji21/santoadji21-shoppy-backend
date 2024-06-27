import { Module } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CheckoutController } from '@/features/checkout/checkout.controller';
import { CheckoutService } from '@/features/checkout/checkout.service';
import { ProductsModule } from '@/features/products/products.module';

@Module({
  imports: [ConfigModule, ProductsModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY'), {
          apiVersion: '2024-06-20',
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class CheckoutModule {}
