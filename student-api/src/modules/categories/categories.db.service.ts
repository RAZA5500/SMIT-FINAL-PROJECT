import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toSkipTake } from '../../common/pagination/pagination.helper';
import { DatabaseService } from '../../database/database.service';
import {
  isForeignKeyViolation,
  isUniqueViolation,
} from '../../database/prisma-errors';
import {
  categoryInclude,
  CategoryRecord,
  ICategoryWriteData,
  IListCategoriesFilter,
} from './types/category.types';

export const CATEGORY_NAME_TAKEN = 'A category with this name already exists';
export const CATEGORY_IN_USE =
  'Category has subcategories or products and cannot be deleted';

@Injectable()
export class CategoriesDbService {
  constructor(private readonly db: DatabaseService) {}

  async list(
    filter: IListCategoriesFilter,
  ): Promise<{ categories: CategoryRecord[]; total: number }> {
    const where: Prisma.CategoryWhereInput = {
      ...(filter.isActive !== undefined && { isActive: filter.isActive }),
      ...(filter.parentId && { parentId: filter.parentId }),
      ...(filter.search && {
        name: { contains: filter.search, mode: 'insensitive' },
      }),
    };

    const [categories, total] = await Promise.all([
      this.db.category.findMany({
        where,
        include: categoryInclude,
        orderBy: [{ depth: 'asc' }, { name: 'asc' }],
        ...toSkipTake(filter.page, filter.limit),
      }),
      this.db.category.count({ where }),
    ]);
    return { categories, total };
  }

  findById(id: string): Promise<CategoryRecord | null> {
    return this.db.category.findUnique({
      where: { id },
      include: categoryInclude,
    });
  }

  /** Same name ya same slug wali koi aur category (update mein khud ko chhod kar) */
  async isNameTaken(
    name: string,
    slug: string,
    excludeId?: string,
  ): Promise<boolean> {
    const count = await this.db.category.count({
      where: {
        OR: [{ name: { equals: name, mode: 'insensitive' } }, { slug }],
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
    return count > 0;
  }

  async create(data: ICategoryWriteData): Promise<CategoryRecord> {
    try {
      return await this.db.category.create({ data, include: categoryInclude });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(CATEGORY_NAME_TAKEN);
      }
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<ICategoryWriteData>,
  ): Promise<CategoryRecord> {
    try {
      return await this.db.category.update({
        where: { id },
        data,
        include: categoryInclude,
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(CATEGORY_NAME_TAKEN);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.category.delete({ where: { id } });
    } catch (error) {
      // Check aur delete ke beech kisi ne child/product add kar diya — FK Restrict bachata hai
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(CATEGORY_IN_USE);
      }
      throw error;
    }
  }
}
