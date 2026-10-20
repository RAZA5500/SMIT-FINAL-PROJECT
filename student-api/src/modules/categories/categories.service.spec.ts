import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesDbService } from './categories.db.service';
import { CategoriesService } from './categories.service';
import type { CategoryRecord } from './types/category.types';

const now = new Date('2026-01-01T00:00:00Z');

function category(overrides: Partial<CategoryRecord> = {}): CategoryRecord {
  return {
    id: 'cat-1',
    name: 'Fruits',
    slug: 'fruits',
    description: null,
    isActive: true,
    parentId: null,
    depth: 0,
    createdAt: now,
    updatedAt: now,
    _count: { children: 0, products: 0 },
    ...overrides,
  };
}

describe('CategoriesService', () => {
  let service: CategoriesService;
  let db: jest.Mocked<
    Pick<
      CategoriesDbService,
      'list' | 'findById' | 'isNameTaken' | 'create' | 'update' | 'delete'
    >
  >;

  beforeEach(() => {
    db = {
      list: jest.fn().mockResolvedValue({ categories: [], total: 0 }),
      findById: jest.fn(),
      isNameTaken: jest.fn().mockResolvedValue(false),
      create: jest
        .fn()
        .mockImplementation((data: Partial<CategoryRecord>) =>
          Promise.resolve(category({ ...data, id: 'new' })),
        ),
      update: jest
        .fn()
        .mockImplementation((id: string, data: Partial<CategoryRecord>) =>
          Promise.resolve(category({ id, ...data })),
        ),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    service = new CategoriesService(db as unknown as CategoriesDbService);
  });

  describe('create', () => {
    it('creates a top-level category with a slug from the name', async () => {
      const result = await service.create({ name: 'Fresh Fruits & Veg' });
      expect(db.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'fresh-fruits-veg',
          depth: 0,
          parentId: null,
        }),
      );
      expect(result.depth).toBe(0);
    });

    it('creates a child at depth 1', async () => {
      db.findById.mockResolvedValue(category({ id: 'parent' }));
      await service.create({ name: 'Citrus', parentId: 'parent' });
      expect(db.create).toHaveBeenCalledWith(
        expect.objectContaining({ parentId: 'parent', depth: 1 }),
      );
    });

    it('rejects a third level with 400 (max 2 levels)', async () => {
      db.findById.mockResolvedValue(category({ id: 'child', depth: 1 }));
      await expect(
        service.create({ name: 'Oranges', parentId: 'child' }),
      ).rejects.toThrow(
        new BadRequestException('Categories can only be nested 2 levels deep'),
      );
    });

    it('rejects a child under a category that has products (409)', async () => {
      db.findById.mockResolvedValue(
        category({ _count: { children: 0, products: 3 } }),
      );
      await expect(
        service.create({ name: 'Citrus', parentId: 'cat-1' }),
      ).rejects.toThrow(ConflictException);
    });

    it('returns 404 for a missing parent', async () => {
      db.findById.mockResolvedValue(null);
      await expect(
        service.create({ name: 'Citrus', parentId: 'missing' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a duplicate name with 409', async () => {
      db.isNameTaken.mockResolvedValue(true);
      await expect(service.create({ name: 'Fruits' })).rejects.toThrow(
        ConflictException,
      );
      expect(db.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('cannot be its own parent', async () => {
      db.findById.mockResolvedValue(category());
      await expect(
        service.update('cat-1', { parentId: 'cat-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('cannot move a category that has children under another one', async () => {
      db.findById.mockResolvedValue(
        category({ _count: { children: 2, products: 0 } }),
      );
      await expect(
        service.update('cat-1', { parentId: 'other' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('parentId null moves the category to the top level', async () => {
      db.findById.mockResolvedValue(category({ parentId: 'p', depth: 1 }));
      await service.update('cat-1', { parentId: null });
      expect(db.update).toHaveBeenCalledWith('cat-1', {
        parentId: null,
        depth: 0,
      });
    });
  });

  describe('delete', () => {
    it.each([[{ children: 1, products: 0 }], [{ children: 0, products: 1 }]])(
      'rejects deleting a category with %o (409)',
      async (counts) => {
        db.findById.mockResolvedValue(category({ _count: counts }));
        await expect(service.delete('cat-1')).rejects.toThrow(
          ConflictException,
        );
        expect(db.delete).not.toHaveBeenCalled();
      },
    );

    it('deletes an empty category', async () => {
      db.findById.mockResolvedValue(category());
      await service.delete('cat-1');
      expect(db.delete).toHaveBeenCalledWith('cat-1');
    });
  });

  describe('ensureLeafAndActive', () => {
    it('404 for missing, 400 for inactive or non-leaf', async () => {
      db.findById.mockResolvedValueOnce(null);
      await expect(service.ensureLeafAndActive('x')).rejects.toThrow(
        NotFoundException,
      );

      db.findById.mockResolvedValueOnce(category({ isActive: false }));
      await expect(service.ensureLeafAndActive('x')).rejects.toThrow(
        BadRequestException,
      );

      db.findById.mockResolvedValueOnce(
        category({ _count: { children: 1, products: 0 } }),
      );
      await expect(service.ensureLeafAndActive('x')).rejects.toThrow(
        BadRequestException,
      );

      db.findById.mockResolvedValueOnce(category());
      await expect(service.ensureLeafAndActive('x')).resolves.toMatchObject({
        id: 'cat-1',
      });
    });
  });

  it('public list always filters to active categories', async () => {
    await service.listPublic({ page: 1, limit: 10 });
    expect(db.list).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: true }),
    );
  });
});
