import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDbService } from './users.db.service';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersDbService],
})
export class UsersModule {}
