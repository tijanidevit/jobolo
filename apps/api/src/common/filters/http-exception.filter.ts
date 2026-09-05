import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import type { ApiErrorResponse, ApiFieldError } from '@jobolo/shared';

/**
 * Global HTTP exception filter.
 * Converts all HttpExceptions (and unhandled errors) into the standardized ApiErrorResponse.
 * Never exposes stack traces, SQL errors, or internal details to clients.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let code = 'INTERNAL_SERVER_ERROR';
    let errors: ApiFieldError[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = this.statusToCode(status);
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const body = exceptionResponse as Record<string, unknown>;
        message = (body['message'] as string) ?? exception.message;
        code = (body['code'] as string) ?? this.statusToCode(status);

        // class-validator produces an array of messages
        if (Array.isArray(body['message'])) {
          message = 'Validation failed';
          code = 'VALIDATION_ERROR';
          errors = (body['message'] as string[]).map((msg) => ({
            field: this.extractField(msg),
            message: msg,
          }));
        }
      }
    } else {
      // Unhandled error — log it but don't expose internals
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorBody: ApiErrorResponse = {
      success: false,
      message,
      code,
      ...(errors && { errors }),
    };

    response.status(status).json(errorBody);
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
    };
    return map[status] ?? 'UNKNOWN_ERROR';
  }

  private extractField(message: string): string {
    // class-validator messages often start with the property name
    const match = message.match(/^(\w+)\s/);
    return match ? match[1] : 'unknown';
  }
}
