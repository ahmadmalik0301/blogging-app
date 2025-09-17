import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class SetRefreshTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const token = data?.refreshToken || data?.data?.refreshToken;
        if (token) {
          res.cookie('refresh_token', token, {
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          if (data?.refreshToken) delete data.refreshToken;
          if (data?.data?.refreshToken) delete data.data.refreshToken;
        }

        return {
          status: 'success',
          message: data?.message || 'Operation successful',
          data: data?.data || data,
        };
      }),
    );
  }
}
