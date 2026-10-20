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
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { IAuthUser } from '../auth/types/auth.types';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { ICart } from './types/cart.types';

/** Cart sirf CUSTOMER ke liye — admin → 403 */
@Roles('CUSTOMER')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  get(@CurrentUser() user: IAuthUser): Promise<ICart> {
    return this.cartService.getCart(user);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clear(@CurrentUser() user: IAuthUser): Promise<void> {
    return this.cartService.clear(user);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  addItem(
    @CurrentUser() user: IAuthUser,
    @Body() dto: AddCartItemDto,
  ): Promise<ICart> {
    return this.cartService.addItem(user, dto);
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<ICart> {
    return this.cartService.updateItem(user, id, dto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.cartService.removeItem(user, id);
  }
}
