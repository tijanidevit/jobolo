import { Request } from 'express';
import type { IAuthenticatedUser } from '../decorators/current-user.decorator.js';

export interface AuthenticatedRequest extends Request {
  user: IAuthenticatedUser;
}
