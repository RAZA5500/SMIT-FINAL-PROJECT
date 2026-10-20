import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  buildMeta,
  IPaginated,
} from '../../common/pagination/pagination.helper';
import { MoneyService } from '../../shared/money/money.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto';
import { toUser } from './mappers/user.mapper';
import { IUser } from './types/user.types';
import { UsersDbService } from './users.db.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersDb: UsersDbService,
    private readonly money: MoneyService,
  ) {}

  async listCustomers(
    query: ListCustomersQueryDto,
  ): Promise<IPaginated<IUser>> {
    const { users, total } = await this.usersDb.listCustomers(query);
    return {
      data: users.map((user) => toUser(user, this.money)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  /**
   * Admin customer ko activate/deactivate karta hai (FLOW-MD 01 §5):
   * apna account → 400, target CUSTOMER na ho → 403, user na mile → 404.
   */
  async updateCustomerStatus(
    actor: IAuthUser,
    customerId: string,
    isActive: boolean,
  ): Promise<IUser> {
    if (actor.id === customerId) {
      throw new BadRequestException(
        'You cannot change your own account status',
      );
    }

    const target = await this.usersDb.findById(customerId);
    if (!target) {
      throw new NotFoundException('User not found');
    }
    if (target.role !== UserRole.CUSTOMER) {
      throw new ForbiddenException(
        'Only customer accounts can be activated or deactivated',
      );
    }

    const updated = await this.usersDb.updateStatus(customerId, isActive);
    return toUser(updated, this.money);
  }
}
