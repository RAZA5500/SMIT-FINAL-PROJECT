import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  registerCustomer,
} from './helpers/auth';
import { createCategory, seedProduct } from './helpers/catalog';
import { createTestApp, resetDatabase } from './helpers/test-app';

describe('Catalog: categories, products, inventory (e2e)', () => {
  let app: INestApplication;
  let admin: ITestUser;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    admin = await createAdmin(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('categories', () => {
    it('max 2 levels: a third level → 400', async () => {
      const parent = await createCategory(app, admin.token, { name: 'Fruits' });
      const child = await createCategory(app, admin.token, {
        name: 'Citrus',
        parentId: parent.id,
      });
      await http(app)
        .post(`${API}/admin/categories`)
        .set(bearer(admin.token))
        .send({ name: 'Oranges', parentId: child.id })
        .expect(400);
    });

    it('name is globally unique (409) and the slug comes from the name', async () => {
      const created = await createCategory(app, admin.token, {
        name: 'Fresh Veg',
      });
      expect(created.slug).toBe('fresh-veg');
      await http(app)
        .post(`${API}/admin/categories`)
        .set(bearer(admin.token))
        .send({ name: 'fresh veg' })
        .expect(409);
    });

    it('no child under a category that has products (409); no delete with children/products (409)', async () => {
      // Top-level leaf category jis mein products hain (depth 0, taa ke sirf products wala rule lage)
      const topLevel = await createCategory(app, admin.token, {
        name: 'Bakery',
      });
      await http(app)
        .post(`${API}/admin/products`)
        .set(bearer(admin.token))
        .send({
          name: 'Bread',
          categoryId: topLevel.id,
          price: 1.2,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 5,
        })
        .expect(201);
      const res = await http(app)
        .post(`${API}/admin/categories`)
        .set(bearer(admin.token))
        .send({ name: 'Sub', parentId: topLevel.id })
        .expect(409);
      expect(res.body.message).toBe(
        'Cannot add a subcategory under a category that has products',
      );
      await http(app)
        .delete(`${API}/admin/categories/${topLevel.id}`)
        .set(bearer(admin.token))
        .expect(409);

      // Children wali category bhi delete nahi hoti
      const parent = await createCategory(app, admin.token, { name: 'Dairy' });
      await createCategory(app, admin.token, {
        name: 'Milk',
        parentId: parent.id,
      });
      await http(app)
        .delete(`${API}/admin/categories/${parent.id}`)
        .set(bearer(admin.token))
        .expect(409);
    });

    it('an empty category can be deleted (204)', async () => {
      const category = await createCategory(app, admin.token);
      await http(app)
        .delete(`${API}/admin/categories/${category.id}`)
        .set(bearer(admin.token))
        .expect(204);
    });

    it('public list only returns active categories; admin sees all', async () => {
      await createCategory(app, admin.token, { name: 'Visible' });
      await createCategory(app, admin.token, {
        name: 'Hidden',
        isActive: false,
      });

      const pub = await http(app).get(`${API}/categories`).expect(200);
      expect(pub.body.data.map((c: { name: string }) => c.name)).toEqual([
        'Visible',
      ]);

      const adm = await http(app)
        .get(`${API}/admin/categories`)
        .set(bearer(admin.token))
        .expect(200);
      expect(adm.body.meta.total).toBe(2);
    });

    it('customer cannot write categories (403)', async () => {
      const customer = await registerCustomer(app);
      await http(app)
        .post(`${API}/admin/categories`)
        .set(bearer(customer.token))
        .send({ name: 'Nope' })
        .expect(403);
    });
  });

  describe('products', () => {
    it('creates with server-generated slug/SKU and a string price', async () => {
      const parent = await createCategory(app, admin.token, { name: 'Fruits' });
      const leaf = await createCategory(app, admin.token, {
        name: 'Citrus',
        parentId: parent.id,
      });
      const res = await http(app)
        .post(`${API}/admin/products`)
        .set(bearer(admin.token))
        .send({
          name: 'Oranges',
          categoryId: leaf.id,
          price: 1.5,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 10,
        })
        .expect(201);
      expect(res.body).toMatchObject({
        slug: 'citrus-oranges',
        price: '1.50',
        isActive: true,
        stockStatus: 'OUT_OF_STOCK',
        inventoryId: null,
      });
      expect(res.body.sku).toMatch(/^CIT-\d{6}$/);
    });

    it('max < min → 400; non-leaf category → 400; same name same category → 409', async () => {
      const parent = await createCategory(app, admin.token);
      const leaf = await createCategory(app, admin.token, {
        parentId: parent.id,
      });
      const body = {
        name: 'Apples',
        categoryId: leaf.id,
        price: 1,
        minimumOrderQuantity: 1,
        maximumOrderQuantity: 5,
      };

      await http(app)
        .post(`${API}/admin/products`)
        .set(bearer(admin.token))
        .send({ ...body, minimumOrderQuantity: 6 })
        .expect(400);
      await http(app)
        .post(`${API}/admin/products`)
        .set(bearer(admin.token))
        .send({ ...body, categoryId: parent.id })
        .expect(400);
      await http(app)
        .post(`${API}/admin/products`)
        .set(bearer(admin.token))
        .send(body)
        .expect(201);
      await http(app)
        .post(`${API}/admin/products`)
        .set(bearer(admin.token))
        .send(body)
        .expect(409);
    });

    it('public catalog hides inactive products (list + detail 404) — server-side filter', async () => {
      const visible = await seedProduct(app, admin.token, {
        name: 'Visible Apples',
      });
      const hidden = await seedProduct(app, admin.token, {
        name: 'Hidden Pears',
      });
      await http(app)
        .patch(`${API}/admin/products/${hidden.productId}`)
        .set(bearer(admin.token))
        .send({ isActive: false })
        .expect(200);

      const list = await http(app).get(`${API}/products`).expect(200);
      expect(list.body.data.map((p: { id: string }) => p.id)).toEqual([
        visible.productId,
      ]);
      // Client isActive=false bheje tab bhi nahi — field public DTO mein hai hi nahi
      await http(app).get(`${API}/products?isActive=false`).expect(400);
      await http(app).get(`${API}/products/${hidden.productId}`).expect(404);

      const adminList = await http(app)
        .get(`${API}/admin/products`)
        .set(bearer(admin.token))
        .expect(200);
      expect(adminList.body.meta.total).toBe(2);
    });

    it('filters by price range, search and parent category; sorts by price', async () => {
      const cheap = await seedProduct(app, admin.token, {
        name: 'Cheap Carrots',
        price: 0.5,
      });
      const dear = await seedProduct(app, admin.token, {
        name: 'Dear Dates',
        price: 9.99,
      });

      const range = await http(app)
        .get(`${API}/products?minPrice=1&maxPrice=10`)
        .expect(200);
      expect(range.body.data.map((p: { id: string }) => p.id)).toEqual([
        dear.productId,
      ]);

      await http(app).get(`${API}/products?minPrice=10&maxPrice=1`).expect(400);

      const search = await http(app)
        .get(`${API}/products?q=carrot`)
        .expect(200);
      expect(search.body.data[0].id).toBe(cheap.productId);

      const sorted = await http(app)
        .get(`${API}/products?sortBy=price_desc`)
        .expect(200);
      expect(sorted.body.data.map((p: { price: string }) => p.price)).toEqual([
        '9.99',
        '0.50',
      ]);

      // Leaf ka parent do to us ke children ke products bhi aate hain
      const leaf = await app
        .get(DatabaseService)
        .category.findUniqueOrThrow({ where: { id: cheap.categoryId } });
      const byParent = await http(app)
        .get(`${API}/products?categoryId=${leaf.parentId}`)
        .expect(200);
      expect(byParent.body.data.map((p: { id: string }) => p.id)).toEqual([
        cheap.productId,
      ]);
    });
  });

  describe('inventory', () => {
    it('one row per product (409), opening stock written as RECEIVED, status from threshold', async () => {
      const seeded = await seedProduct(app, admin.token, {
        qty: 5,
        lowStockThreshold: 10,
      });
      await http(app)
        .post(`${API}/admin/inventory`)
        .set(bearer(admin.token))
        .send({ productId: seeded.productId, qtyOnHand: 1 })
        .expect(409);

      const txns = await http(app)
        .get(`${API}/admin/inventory/${seeded.inventoryId}/transactions`)
        .set(bearer(admin.token))
        .expect(200);
      expect(txns.body.data).toMatchObject([{ type: 'RECEIVED', quantity: 5 }]);

      const product = await http(app)
        .get(`${API}/products/${seeded.productId}`)
        .expect(200);
      expect(product.body.stockStatus).toBe('LOW_STOCK');
    });

    it('DAMAGE +5 → 400; stock never negative (10 − 11 → 400)', async () => {
      const { inventoryId } = await seedProduct(app, admin.token, { qty: 10 });
      await http(app)
        .post(`${API}/admin/inventory/adjustments`)
        .set(bearer(admin.token))
        .send({ inventoryId, quantity: 5, reason: 'DAMAGE' })
        .expect(400);
      const res = await http(app)
        .post(`${API}/admin/inventory/adjustments`)
        .set(bearer(admin.token))
        .send({ inventoryId, quantity: -11, reason: 'RECOUNT' })
        .expect(400);
      expect(res.body.message).toBe('Stock cannot go negative. Available: 10.');
    });

    it('adjustment updates stock, status and the ledger', async () => {
      const { inventoryId } = await seedProduct(app, admin.token, {
        qty: 10,
        lowStockThreshold: 3,
      });
      const res = await http(app)
        .post(`${API}/admin/inventory/adjustments`)
        .set(bearer(admin.token))
        .send({
          inventoryId,
          quantity: -10,
          reason: 'DAMAGE',
          note: 'Flooded storage',
        })
        .expect(201);
      expect(res.body.inventory).toMatchObject({
        qtyOnHand: 0,
        stockStatus: 'OUT_OF_STOCK',
      });
      expect(res.body.transaction).toMatchObject({
        type: 'ADJUSTMENT_DECREASE',
        quantity: 10,
        reason: 'DAMAGE',
        note: 'Flooded storage',
        performedBy: admin.id,
      });

      const list = await http(app)
        .get(`${API}/admin/inventory?stockStatus=OUT_OF_STOCK`)
        .set(bearer(admin.token))
        .expect(200);
      expect(list.body.data).toHaveLength(1);
    });

    it('two parallel adjustments are serialised by the row lock (no lost update)', async () => {
      const { inventoryId } = await seedProduct(app, admin.token, { qty: 10 });
      const adjust = () =>
        http(app)
          .post(`${API}/admin/inventory/adjustments`)
          .set(bearer(admin.token))
          .send({ inventoryId, quantity: -6, reason: 'RECOUNT' });
      const results = await Promise.all([adjust(), adjust()]);
      expect(results.map((r) => r.status).sort()).toEqual([201, 400]);

      const row = await app
        .get(DatabaseService)
        .inventory.findUniqueOrThrow({ where: { id: inventoryId } });
      expect(row.qtyOnHand).toBe(4);
    });
  });
});
