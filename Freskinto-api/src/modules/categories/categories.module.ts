import { Module } from '@nestjs/common';
import { AdminCategoriesController } from './admin-categories.controller';
import { CategoriesController } from './categories.controller';
import { CategoriesDbService } from './categories.db.service';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController, AdminCategoriesController],
  providers: [CategoriesService, CategoriesDbService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
