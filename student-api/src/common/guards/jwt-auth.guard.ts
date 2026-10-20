import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthDbService } from '../../modules/auth/auth.db.service';
import type {
  IAuthenticatedRequest,
  IJwtPayload,
} from '../../modules/auth/types/auth.types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global guard — deny by default; `@Public()` se opt-out (FLOW-MD 06 §6).
 * Har request par user DB se load hota hai taa ke deactivated user ka purana
 * token bhi foran bekaar ho jaye aur role hamesha DB wala ho.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authDb: AuthDbService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);
    const payload = await this.verifyToken(token);

    const user = await this.authDb.findAuthUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid authentication token');
    }
    if (!user.isActive) {
      throw new ForbiddenException(
        'User account is deactivated. Please contact support.',
      );
    }

    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return true;
  }

  private extractBearerToken(header: string | undefined): string {
    if (!header) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }
    return token;
  }

  private async verifyToken(token: string): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync<IJwtPayload>(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token has expired. Please login again.',
        );
      }
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
