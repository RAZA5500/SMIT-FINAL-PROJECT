import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartDbService } from './cart.db.service';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartDbService],
  exports: [CartDbService],
})
export class CartModule {}
