import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new CustomUnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class CustomUnauthorizedException extends UnauthorizedException {
  constructor() {
    super({
      message: 'You are not authorized to perform this action',
      statusCode: 401,
    });
  }
}
