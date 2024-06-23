import { comparePasswords, excludePassword } from '@/common/utils/auth.utils';
import { TokenPayload } from '@/features/auth/schema/token.schema';
import { UsersService } from '@/features/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, res: Response) {
    const expired = new Date();
    expired.setMilliseconds(
      expired.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRES_IN')),
    );
    const tokenPayload: TokenPayload = {
      email: user.email,
      userId: user.id,
    };
    const token = await this.jwtService.signAsync(tokenPayload);
    res.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires: expired,
    });

    return token;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ email });
    if (!user) {
      throw new UnauthorizedException('Email does not exist');
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return excludePassword(user);
  }
}
