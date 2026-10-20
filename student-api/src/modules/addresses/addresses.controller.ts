import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import type { IPaginated } from '../../common/pagination/pagination.helper';
import type { IAuthUser } from '../auth/types/auth.types';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import type { IAddress } from './types/address.types';

/** "Meri addresses" — user id URL se kabhi nahi, token se */
@Roles('CUSTOMER')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  list(
    @CurrentUser() user: IAuthUser,
    @Query() query: PaginationDto,
  ): Promise<IPaginated<IAddress>> {
    return this.addressesService.list(user, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: IAuthUser,
    @Body() dto: CreateAddressDto,
  ): Promise<IAddress> {
    return this.addressesService.create(user, dto);
  }

  @Patch(':id/default')
  setDefault(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IAddress> {
    return this.addressesService.setDefault(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<IAddress> {
    return this.addressesService.update(user, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.addressesService.delete(user, id);
  }
}
