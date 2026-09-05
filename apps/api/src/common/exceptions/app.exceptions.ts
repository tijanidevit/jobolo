import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Domain-specific exceptions.
 * Use these instead of generic HttpExceptions to make code expressive
 * and error codes predictable in the API contract.
 */

export class AppNotFoundException extends HttpException {
  constructor(resource: string, code?: string) {
    super(
      {
        message: `${resource} not found`,
        code: code ?? 'NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AppForbiddenException extends HttpException {
  constructor(message = 'Access denied', code = 'FORBIDDEN') {
    super({ message, code }, HttpStatus.FORBIDDEN);
  }
}

export class AppConflictException extends HttpException {
  constructor(message: string, code = 'CONFLICT') {
    super({ message, code }, HttpStatus.CONFLICT);
  }
}

export class AppUnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super({ message, code }, HttpStatus.UNAUTHORIZED);
  }
}

export class AppBadRequestException extends HttpException {
  constructor(message: string, code = 'BAD_REQUEST') {
    super({ message, code }, HttpStatus.BAD_REQUEST);
  }
}
