import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT refresh token guard.
 * Apply to the refresh token endpoint only.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
