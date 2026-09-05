import { Request } from 'express';
import type { AuthenticatedUser } from '../decorators/current-user.decorator.js';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
