import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import type { IAuthUser } from '../auth/types/auth.types';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import type { IUser } from './types/user.types';
import { UsersService } from './users.service';

@Roles('ADMIN')
@Controller('admin/customers')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@Query() query: ListCustomersQueryDto): Promise<IPaginated<IUser>> {
    return this.usersService.listCustomers(query);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerStatusDto,
    @CurrentUser() actor: IAuthUser,
  ): Promise<IUser> {
    return this.usersService.updateCustomerStatus(actor, id, dto.isActive);
  }
}
