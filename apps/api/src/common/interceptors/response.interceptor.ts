import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@jobolo/shared';

/**
 * Wraps all successful controller responses in the standardized ApiResponse envelope.
 *
 * Controllers return raw data or { message, data } shaped objects.
 * This interceptor normalizes them to ApiResponse<T>.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        // If the controller explicitly returns a shaped response, pass it through
        if (response && typeof response === 'object' && 'success' in response) {
          return response as ApiResponse<T>;
        }

        // Handle { message, data } shaped returns from controllers
        if (response && typeof response === 'object' && 'data' in response) {
          const { message, data, meta } = response as {
            message?: string;
            data: T;
            meta?: unknown;
          };
          return {
            success: true,
            message: message ?? 'Request successful',
            data,
            ...(meta && { meta }),
          } as ApiResponse<T>;
        }

        // Plain data return
        return {
          success: true,
          message: 'Request successful',
          data: response as T,
        } as ApiResponse<T>;
      }),
    );
  }
}
