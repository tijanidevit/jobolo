import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';

interface JwtRefreshPayload {
  sub: string;
  email: string;
}

/**
 * JWT refresh token strategy.
 * Validates the refresh token and attaches the raw token for rotation.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') ?? 'fallback-refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): IAuthenticatedUser & { refreshToken: string } {
    const refreshToken = (req.body as { refreshToken: string }).refreshToken;
    return { id: payload.sub, email: payload.email, refreshToken };
  }
}
