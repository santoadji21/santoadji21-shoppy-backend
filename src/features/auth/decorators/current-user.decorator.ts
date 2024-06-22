import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export default CurrentUser;
