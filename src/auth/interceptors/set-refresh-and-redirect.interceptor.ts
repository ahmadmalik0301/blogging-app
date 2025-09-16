import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class SetRefreshTokenAndRedirectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (!data) return;

        const token = data.refreshToken || data?.data?.refreshToken;
        if (token) {
          res.cookie('refresh_token', token, {
            httpOnly: true,
            signed: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
          });
        }

        if (data.redirectUrl) {
          res.redirect(data.redirectUrl);
        } else {
          res.json({
            status: 'success',
            message: data?.message || 'Operation successful',
            data: data?.data || data,
          });
        }
      }),
    );
  }
}
