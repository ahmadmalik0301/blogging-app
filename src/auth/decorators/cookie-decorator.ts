import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCookie = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (data) {
    return request.signedCookies?.[data];
  }

  return request.signedCookies;
});
