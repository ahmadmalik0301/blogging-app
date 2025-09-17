import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ClearRefreshTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        res.clearCookie('refresh_token', {
          httpOnly: true,
          signed: true,
          secure: true,
          sameSite: 'lax',
        });
        return {
          status: 'success',
          message: data?.message || 'Logged out successfully',
          data: data?.data || data,
        };
      }),
    );
  }
}
