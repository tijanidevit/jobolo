import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@jobolo/shared';
import { API_MESSAGE_KEY } from '../decorators/api-message.decorator.js';

/**
 * Wraps successful controller responses in the standardized success envelope.
 * The message comes from @ApiMessage() metadata, with controller-provided
 * message/data/meta values still supported for transition purposes.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const message =
      this.reflector.getAllAndOverride<string>(API_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Request successful';
    const httpResponse = context.switchToHttp().getResponse<{ statusCode?: number }>();

    return next.handle().pipe(
      map((body) => {
        if (httpResponse.statusCode === HttpStatus.NO_CONTENT) {
          return undefined as unknown as ApiResponse<T>;
        }

        // If the controller explicitly returns a shaped success response, pass it through
        if (body && typeof body === 'object' && 'success' in body) {
          return body as ApiResponse<T>;
        }

        // Handle transitional { message, data, meta } shaped returns from controllers
        if (body && typeof body === 'object' && ('data' in body || 'meta' in body || 'message' in body)) {
          const { message: responseMessage, data, meta } = body as {
            message?: string;
            data: T;
            meta?: unknown;
          };
          return {
            success: true,
            message: responseMessage ?? message,
            data: (data ?? null) as T,
            ...(meta !== undefined ? { meta } : {}),
          } as ApiResponse<T>;
        }

        // Plain data return
        return {
          success: true,
          message,
          data: (body ?? null) as T,
        } as ApiResponse<T>;
      }),
    );
  }
}
