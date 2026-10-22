import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  buildMeta,
  IPaginated,
} from '../../common/pagination/pagination.helper';
import { slugify } from '../../common/utils/slugify';
import {
  CATEGORY_IN_USE,
  CATEGORY_NAME_TAKEN,
  CategoriesDbService,
} from './categories.db.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  AdminCategoriesQueryDto,
  PublicCategoriesQueryDto,
} from './dto/list-categories-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { toCategory } from './mappers/category.mapper';
import {
  CATEGORY_MAX_DEPTH,
  CategoryRecord,
  ICategory,
  ICategoryWriteData,
} from './types/category.types';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesDb: CategoriesDbService) {}

  /** Public catalog — inactive categories kabhi nahi (server-side filter) */
  listPublic(query: PublicCategoriesQueryDto): Promise<IPaginated<ICategory>> {
    return this.list({ ...query, isActive: true });
  }

  listAdmin(query: AdminCategoriesQueryDto): Promise<IPaginated<ICategory>> {
    return this.list(query);
  }

  async create(dto: CreateCategoryDto): Promise<ICategory> {
    const slug = await this.uniqueSlugFor(dto.name);
    const parent = dto.parentId
      ? await this.validateParent(dto.parentId)
      : null;

    const created = await this.categoriesDb.create({
      name: dto.name,
      slug,
      description: dto.description ?? null,
      parentId: parent?.id ?? null,
      depth: parent ? parent.depth + 1 : 0,
      isActive: dto.isActive ?? true,
    });
    return toCategory(created);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
    const category = await this.findOrFail(id);
    const data: Partial<ICategoryWriteData> = {};

    if (dto.name !== undefined && dto.name !== category.name) {
      data.name = dto.name;
      data.slug = await this.uniqueSlugFor(dto.name, id);
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    // undefined = parent waisa hi; null = top-level; id = re-parent
    if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
      if (dto.parentId === null) {
        data.parentId = null;
        data.depth = 0;
      } else {
        if (dto.parentId === id) {
          throw new BadRequestException('A category cannot be its own parent');
        }
        if (category._count.children > 0) {
          // Subtree depth limit: children wali category kisi ke neeche jaye to 3 levels ho jayenge
          throw new BadRequestException(
            'A category with subcategories cannot be moved under another category',
          );
        }
        const parent = await this.validateParent(dto.parentId);
        data.parentId = parent.id;
        data.depth = parent.depth + 1;
      }
    }

    const updated = await this.categoriesDb.update(id, data);
    return toCategory(updated);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findOrFail(id);
    if (category._count.children > 0 || category._count.products > 0) {
      throw new ConflictException(CATEGORY_IN_USE);
    }
    await this.categoriesDb.delete(id);
  }

  /**
   * Product sirf leaf + active category mein assign hota hai (FLOW-MD 01 §8).
   * Products module isay use karta hai.
   */
  async ensureLeafAndActive(categoryId: string): Promise<CategoryRecord> {
    const category = await this.categoriesDb.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (!category.isActive || category._count.children > 0) {
      throw new BadRequestException(
        'Products can only be added to an active leaf category',
      );
    }
    return category;
  }

  private async list(
    filter: AdminCategoriesQueryDto,
  ): Promise<IPaginated<ICategory>> {
    const { categories, total } = await this.categoriesDb.list(filter);
    return {
      data: categories.map(toCategory),
      meta: buildMeta(total, filter.page, filter.limit),
    };
  }

  private async findOrFail(id: string): Promise<CategoryRecord> {
    const category = await this.categoriesDb.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  /** Max 2 levels, aur jis category ke paas products hain us ke neeche child nahi */
  private async validateParent(parentId: string): Promise<CategoryRecord> {
    const parent = await this.categoriesDb.findById(parentId);
    if (!parent) {
      throw new NotFoundException('Parent category not found');
    }
    if (parent.depth >= CATEGORY_MAX_DEPTH) {
      throw new BadRequestException(
        'Categories can only be nested 2 levels deep',
      );
    }
    if (parent._count.products > 0) {
      throw new ConflictException(
        'Cannot add a subcategory under a category that has products',
      );
    }
    return parent;
  }

  private async uniqueSlugFor(
    name: string,
    excludeId?: string,
  ): Promise<string> {
    const slug = slugify(name);
    if (!slug) {
      throw new BadRequestException('Name must contain letters or numbers');
    }
    if (await this.categoriesDb.isNameTaken(name, slug, excludeId)) {
      throw new ConflictException(CATEGORY_NAME_TAKEN);
    }
    return slug;
  }
}
