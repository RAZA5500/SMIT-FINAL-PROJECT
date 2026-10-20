import type { UserRole } from '@prisma/client';
import type { Request } from 'express';
import type { IUser } from '../../users/types/user.types';

/** JWT payload — sirf identifiers, koi secret/PII nahi (FLOW-MD 06 §4) */
export interface IJwtPayload {
  sub: string;
  role: UserRole;
}

/** Guard har request par DB se load karta hai — role DB ka, token ka nahi */
export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface IAuthenticatedRequest extends Request {
  user: IAuthUser;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}
