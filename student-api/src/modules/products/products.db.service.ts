import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toSkipTake } from '../../common/pagination/pagination.helper';
import { DatabaseService } from '../../database/database.service';
import { isUniqueViolation } from '../../database/prisma-errors';
import {
  IListProductsFilter,
  IProductWriteData,
  productInclude,
  ProductRecord,
  ProductSort,
} from './types/product.types';

export const PRODUCT_NAME_TAKEN =
  'A product with this name already exists in this category';

const SORT_ORDER: Record<ProductSort, Prisma.ProductOrderByWithRelationInput> =
  {
    newest: { createdAt: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    name_asc: { name: 'asc' },
  };

@Injectable()
export class ProductsDbService {
  constructor(private readonly db: DatabaseService) {}

  async list(
    filter: IListProductsFilter,
  ): Promise<{ products: ProductRecord[]; total: number }> {
    const where: Prisma.ProductWhereInput = {
      ...(filter.isActive !== undefined && { isActive: filter.isActive }),
      ...(filter.q && {
        OR: [
          { name: { contains: filter.q, mode: 'insensitive' } },
          { sku: { contains: filter.q, mode: 'insensitive' } },
        ],
      }),
      ...(filter.categoryId && {
        // Products sirf leaf mein hote hain — parent do to us ke children ke products
        AND: [
          {
            OR: [
              { categoryId: filter.categoryId },
              { category: { parentId: filter.categoryId } },
            ],
          },
        ],
      }),
      ...((filter.minPrice !== undefined || filter.maxPrice !== undefined) && {
        price: {
          ...(filter.minPrice !== undefined && { gte: filter.minPrice }),
          ...(filter.maxPrice !== undefined && { lte: filter.maxPrice }),
        },
      }),
    };

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        include: productInclude,
        orderBy: [SORT_ORDER[filter.sortBy ?? 'newest'], { id: 'asc' }],
        ...toSkipTake(filter.page, filter.limit),
      }),
      this.db.product.count({ where }),
    ]);
    return { products, total };
  }

  findById(id: string): Promise<ProductRecord | null> {
    return this.db.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  findActiveById(id: string): Promise<ProductRecord | null> {
    return this.db.product.findFirst({
      where: { id, isActive: true },
      include: productInclude,
    });
  }

  async isNameTakenInCategory(
    name: string,
    categoryId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const count = await this.db.product.count({
      where: {
        categoryId,
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
    return count > 0;
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.db.product.count({
      where: { slug, ...(excludeId && { NOT: { id: excludeId } }) },
    });
    return count > 0;
  }

  /** Race-safe SKU number — MAX()+1 nahi, DB sequence (FLOW-MD 03 §1) */
  async nextSkuNumber(): Promise<number> {
    const [row] = await this.db.$queryRaw<{ value: bigint }[]>`
      SELECT nextval('product_sku_seq') AS value`;
    return Number(row.value);
  }

  async create(data: IProductWriteData): Promise<ProductRecord> {
    try {
      return await this.db.product.create({ data, include: productInclude });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(PRODUCT_NAME_TAKEN);
      }
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<Omit<IProductWriteData, 'sku'>>,
  ): Promise<ProductRecord> {
    try {
      return await this.db.product.update({
        where: { id },
        data,
        include: productInclude,
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(PRODUCT_NAME_TAKEN);
      }
      throw error;
    }
  }
}
