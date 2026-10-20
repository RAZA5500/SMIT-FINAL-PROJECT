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
import { MoneyService } from '../../shared/money/money.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  AdminProductsQueryDto,
  PublicProductsQueryDto,
} from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { toAdminProduct, toProduct } from './mappers/product.mapper';
import { PRODUCT_NAME_TAKEN, ProductsDbService } from './products.db.service';
import {
  IAdminProduct,
  IProduct,
  IProductWriteData,
  ProductRecord,
} from './types/product.types';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsDb: ProductsDbService,
    private readonly categoriesService: CategoriesService,
    private readonly money: MoneyService,
  ) {}

  /** Public catalog — inactive products server-side filter (FLOW-MD 01 §10, Q2 fix) */
  async listPublic(
    query: PublicProductsQueryDto,
  ): Promise<IPaginated<IProduct>> {
    this.assertPriceRange(query);
    const { products, total } = await this.productsDb.list({
      ...query,
      isActive: true,
    });
    return {
      data: products.map((product) => toProduct(product, this.money)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  async getPublic(id: string): Promise<IProduct> {
    const product = await this.productsDb.findActiveById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return toProduct(product, this.money);
  }

  async listAdmin(
    query: AdminProductsQueryDto,
  ): Promise<IPaginated<IAdminProduct>> {
    this.assertPriceRange(query);
    const { products, total } = await this.productsDb.list(query);
    return {
      data: products.map((product) => toAdminProduct(product, this.money)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  async getAdmin(id: string): Promise<IAdminProduct> {
    return toAdminProduct(await this.findOrFail(id), this.money);
  }

  async create(dto: CreateProductDto): Promise<IAdminProduct> {
    this.assertOrderQuantities(
      dto.minimumOrderQuantity,
      dto.maximumOrderQuantity,
    );
    const category = await this.categoriesService.ensureLeafAndActive(
      dto.categoryId,
    );
    if (await this.productsDb.isNameTakenInCategory(dto.name, category.id)) {
      throw new ConflictException(PRODUCT_NAME_TAKEN);
    }

    const created = await this.productsDb.create({
      name: dto.name,
      slug: await this.uniqueSlug(category.slug, dto.name),
      sku: await this.generateSku(category.slug),
      categoryId: category.id,
      price: dto.price,
      minimumOrderQuantity: dto.minimumOrderQuantity,
      maximumOrderQuantity: dto.maximumOrderQuantity,
      isActive: dto.isActive ?? true,
    });
    return toAdminProduct(created, this.money);
  }

  async update(id: string, dto: UpdateProductDto): Promise<IAdminProduct> {
    const product = await this.findOrFail(id);
    this.assertOrderQuantities(
      dto.minimumOrderQuantity ?? product.minimumOrderQuantity,
      dto.maximumOrderQuantity ?? product.maximumOrderQuantity,
    );

    const data: Partial<Omit<IProductWriteData, 'sku'>> = {};
    const name = dto.name ?? product.name;
    let categorySlug = product.category.slug;

    if (dto.categoryId !== undefined && dto.categoryId !== product.categoryId) {
      const category = await this.categoriesService.ensureLeafAndActive(
        dto.categoryId,
      );
      data.categoryId = category.id;
      categorySlug = category.slug;
    }

    if (dto.name !== undefined || data.categoryId !== undefined) {
      const categoryId = data.categoryId ?? product.categoryId;
      if (await this.productsDb.isNameTakenInCategory(name, categoryId, id)) {
        throw new ConflictException(PRODUCT_NAME_TAKEN);
      }
      data.name = name;
      data.slug = await this.uniqueSlug(categorySlug, name, id);
    }

    if (dto.price !== undefined) data.price = dto.price;
    if (dto.minimumOrderQuantity !== undefined) {
      data.minimumOrderQuantity = dto.minimumOrderQuantity;
    }
    if (dto.maximumOrderQuantity !== undefined) {
      data.maximumOrderQuantity = dto.maximumOrderQuantity;
    }
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const updated = await this.productsDb.update(id, data);
    return toAdminProduct(updated, this.money);
  }

  private async findOrFail(id: string): Promise<ProductRecord> {
    const product = await this.productsDb.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private assertOrderQuantities(min: number, max: number): void {
    if (max < min) {
      throw new BadRequestException(
        'Maximum order quantity must be greater than or equal to minimum order quantity',
      );
    }
  }

  private assertPriceRange(query: { minPrice?: number; maxPrice?: number }) {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }
  }

  /** `<categorySlug>-<nameSlug>[-n]` */
  private async uniqueSlug(
    categorySlug: string,
    name: string,
    excludeId?: string,
  ): Promise<string> {
    const nameSlug = slugify(name);
    if (!nameSlug) {
      throw new BadRequestException('Name must contain letters or numbers');
    }
    const base = `${categorySlug}-${nameSlug}`;
    let slug = base;
    for (let n = 2; await this.productsDb.slugExists(slug, excludeId); n++) {
      slug = `${base}-${n}`;
    }
    return slug;
  }

  /** `<CAT3>-<000001>` — number DB sequence se (race-safe) */
  private async generateSku(categorySlug: string): Promise<string> {
    const prefix = categorySlug
      .replace(/[^a-z]/g, '')
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, 'X');
    const number = await this.productsDb.nextSkuNumber();
    return `${prefix}-${String(number).padStart(6, '0')}`;
  }
}
