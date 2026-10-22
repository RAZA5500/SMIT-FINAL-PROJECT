import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MoneyService } from '../../shared/money/money.service';
import { toUser } from '../users/mappers/user.mapper';
import { IUser } from '../users/types/user.types';
import {
  AuthDbService,
  EMAIL_TAKEN_MESSAGE,
  PHONE_TAKEN_MESSAGE,
} from './auth.db.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';
import type {
  IAuthUser,
  IJwtPayload,
  ILoginResponse,
} from './types/auth.types';

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
export const ACCOUNT_DEACTIVATED_MESSAGE =
  'User account is deactivated. Please contact support.';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDb: AuthDbService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly money: MoneyService,
  ) {}

  async register(dto: RegisterDto): Promise<IUser> {
    if (await this.authDb.existsByEmail(dto.email)) {
      throw new ConflictException(EMAIL_TAKEN_MESSAGE);
    }
    if (dto.phone && (await this.authDb.existsByPhone(dto.phone))) {
      throw new ConflictException(PHONE_TAKEN_MESSAGE);
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.authDb.createCustomer({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      passwordHash,
    });
    return toUser(user, this.money);
  }

  /**
   * Email na mile ya password ghalat — dono par same 401, taa ke koi pata na
   * laga sake kaunsi email registered hai (FLOW-MD 06 §4).
   */
  async login(dto: LoginDto): Promise<ILoginResponse> {
    const user = await this.authDb.findByEmailWithPassword(dto.email);
    const passwordMatches = await this.passwordService.verify(
      dto.password,
      user?.passwordHash,
    );
    if (!user || !passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    if (!user.isActive) {
      throw new ForbiddenException(ACCOUNT_DEACTIVATED_MESSAGE);
    }

    const payload: IJwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const updated = await this.authDb.touchLastLogin(user.id);
    return { accessToken, user: toUser(updated, this.money) };
  }

  async me(authUser: IAuthUser): Promise<IUser> {
    const user = await this.authDb.findById(authUser.id);
    if (!user) {
      throw new UnauthorizedException('Invalid authentication token');
    }
    return toUser(user, this.money);
  }
}
