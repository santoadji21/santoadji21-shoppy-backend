import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import {
  CreateSessionRequestDto,
  SessionSchema,
} from '@/features/checkout/dto/create-session.request';
import { CheckoutService } from '@/features/checkout/checkout.service';
import { ZodValidation } from '@/common/decorators/zod-decorators';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  @ZodValidation(SessionSchema)
  async createSession(@Body() request: CreateSessionRequestDto) {
    return this.checkoutService.createSession(request);
  }

  @Post('webhook')
  @UseGuards(JwtAuthGuard)
  async handleCheckoutWebhook(@Body() event: any) {
    return this.checkoutService.handleCheckoutWebhook(event);
  }
}
