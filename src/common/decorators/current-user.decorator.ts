import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CenterUser } from '../../database/entities/center-user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CenterUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
