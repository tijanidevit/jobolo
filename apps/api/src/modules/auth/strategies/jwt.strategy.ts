import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';

interface JwtPayload {
  sub: string;
  email: string;
}

/**
 * JWT access token strategy.
 * Validates the access token on protected routes.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') ?? 'fallback-secret',
    });
  }

  validate(payload: JwtPayload): IAuthenticatedUser {
    return { id: payload.sub, email: payload.email };
  }
}
