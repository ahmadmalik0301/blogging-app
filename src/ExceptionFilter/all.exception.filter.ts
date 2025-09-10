import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errorType: string;

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Record already exists (unique constraint failed)';
          errorType = 'Conflict';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record does not exist';
          errorType = 'NotFound';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = exception.message;
          errorType = 'PrismaError';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        errorType = exception.name;
      } else if (typeof res === 'object' && res['message']) {
        message = Array.isArray(res['message']) ? res['message'].join(', ') : res['message'];
        errorType = res['error'] || exception.name;
      } else {
        message = 'Something went wrong';
        errorType = exception.name;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      errorType = exception.name || 'InternalServerError';
    }

    response.status(status).json({
      status: 'error',
      message,
      error: {
        type: errorType,
        statusCode: status,
      },
    });
  }
}
