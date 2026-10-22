import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MoneyService } from '../../shared/money/money.service';
import { CategoriesService } from '../categories/categories.service';
import type { CategoryRecord } from '../categories/types/category.types';
import { ProductsDbService } from './products.db.service';
import { ProductsService } from './products.service';
import type { ProductRecord } from './types/product.types';

const now = new Date('2026-01-01T00:00:00Z');

const leaf = {
  id: 'cat-1',
  slug: 'citrus',
  name: 'Citrus',
} as CategoryRecord;

function product(overrides: Partial<ProductRecord> = {}): ProductRecord {
  return {
    id: 'p1',
    name: 'Oranges',
    slug: 'citrus-oranges',
    sku: 'CIT-000001',
    categoryId: 'cat-1',
    price: new Prisma.Decimal('1.50'),
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 10,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    category: { id: 'cat-1', name: 'Citrus', slug: 'citrus' },
    inventory: null,
    ...overrides,
  };
}

const createDto = {
  name: 'Oranges',
  categoryId: 'cat-1',
  price: 1.5,
  minimumOrderQuantity: 1,
  maximumOrderQuantity: 10,
};

describe('ProductsService', () => {
  let service: ProductsService;
  let db: jest.Mocked<
    Pick<
      ProductsDbService,
      | 'list'
      | 'findById'
      | 'findActiveById'
      | 'isNameTakenInCategory'
      | 'slugExists'
      | 'nextSkuNumber'
      | 'create'
      | 'update'
    >
  >;
  let categories: jest.Mocked<Pick<CategoriesService, 'ensureLeafAndActive'>>;

  beforeEach(() => {
    db = {
      list: jest.fn().mockResolvedValue({ products: [], total: 0 }),
      findById: jest.fn(),
      findActiveById: jest.fn(),
      isNameTakenInCategory: jest.fn().mockResolvedValue(false),
      slugExists: jest.fn().mockResolvedValue(false),
      nextSkuNumber: jest.fn().mockResolvedValue(42),
      create: jest.fn().mockResolvedValue(product()),
      update: jest.fn().mockResolvedValue(product()),
    };
    categories = { ensureLeafAndActive: jest.fn().mockResolvedValue(leaf) };
    service = new ProductsService(
      db as unknown as ProductsDbService,
      categories as unknown as CategoriesService,
      new MoneyService(),
    );
  });

  describe('create', () => {
    it('rejects max < min with 400 before touching the database', async () => {
      await expect(
        service.create({
          ...createDto,
          minimumOrderQuantity: 5,
          maximumOrderQuantity: 2,
        }),
      ).rejects.toThrow(BadRequestException);
      expect(db.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate name in the same category (409)', async () => {
      db.isNameTakenInCategory.mockResolvedValue(true);
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('only allows leaf + active categories (error comes from CategoriesService)', async () => {
      categories.ensureLeafAndActive.mockRejectedValue(
        new BadRequestException(
          'Products can only be added to an active leaf category',
        ),
      );
      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('generates slug <category>-<name> and SKU <CAT3>-<000042>', async () => {
      await service.create(createDto);
      expect(db.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'citrus-oranges',
          sku: 'CIT-000042',
          isActive: true,
        }),
      );
    });

    it('adds a -n suffix when the slug already exists', async () => {
      db.slugExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      await service.create(createDto);
      expect(db.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'citrus-oranges-2' }),
      );
    });
  });

  describe('update', () => {
    it('checks max >= min against the merged values', async () => {
      db.findById.mockResolvedValue(product({ minimumOrderQuantity: 5 }));
      await expect(
        service.update('p1', { maximumOrderQuantity: 3 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns 404 for an unknown product', async () => {
      db.findById.mockResolvedValue(null);
      await expect(service.update('nope', { price: 2 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('public catalog', () => {
    it('forces isActive=true on the public list', async () => {
      await service.listPublic({ page: 1, limit: 10 });
      expect(db.list).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: true }),
      );
    });

    it('rejects minPrice > maxPrice with 400', async () => {
      await expect(
        service.listPublic({ page: 1, limit: 10, minPrice: 10, maxPrice: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns 404 for an inactive or missing product', async () => {
      db.findActiveById.mockResolvedValue(null);
      await expect(service.getPublic('p1')).rejects.toThrow(NotFoundException);
    });

    it('maps a product without inventory as OUT_OF_STOCK with a string price', async () => {
      db.findActiveById.mockResolvedValue(product());
      const result = await service.getPublic('p1');
      expect(result.stockStatus).toBe('OUT_OF_STOCK');
      expect(result.price).toBe('1.50');
    });
  });
});
