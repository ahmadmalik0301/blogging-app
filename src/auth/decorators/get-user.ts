import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    throw new NotFoundException('User not found in request');
  }

  if (data) {
    if (!(data in user)) {
      throw new NotFoundException(`Property "${data}" not found on user`);
    }
    return user[data];
  }

  return user;
});
