import { AuthService } from '@/features/auth/auth.service';
import CurrentUser from '@/features/auth/decorators/current-user.decorator';
import { LocalAuthGuard } from '@/features/auth/guards/local-auth.guard';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const tokenUser = await this.authService.login(user, res);
    return {
      token: tokenUser,
    };
  }
}
