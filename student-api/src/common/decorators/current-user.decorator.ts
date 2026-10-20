import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type {
  IAuthenticatedRequest,
  IAuthUser,
} from '../../modules/auth/types/auth.types';

/**
 * JwtAuthGuard ka set kiya hua user. User id hamesha yahin se aati hai —
 * body ya URL se kabhi nahi (IDOR se bachao).
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): IAuthUser =>
    context.switchToHttp().getRequest<IAuthenticatedRequest>().user,
);
