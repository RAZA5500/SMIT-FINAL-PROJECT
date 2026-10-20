import { INestApplication } from '@nestjs/common';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  registerCustomer,
} from './helpers/auth';
import { addToCart, seedProduct } from './helpers/catalog';
import { createTestApp, resetDatabase } from './helpers/test-app';

describe('Cart (e2e)', () => {
  let app: INestApplication;
  let admin: ITestUser;
  let customer: ITestUser;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    admin = await createAdmin(app);
    customer = await registerCustomer(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /cart creates an empty cart; admin gets 403', async () => {
    const res = await http(app)
      .get(`${API}/cart`)
      .set(bearer(customer.token))
      .expect(200);
    expect(res.body).toMatchObject({
      items: [],
      itemCount: 0,
      subtotal: '0.00',
      grandTotal: '0.00',
    });
    await http(app).get(`${API}/cart`).set(bearer(admin.token)).expect(403);
  });

  it('stock 5, max 10 → adding 6 → 400 "Only 5 units available"', async () => {
    const { productId } = await seedProduct(app, admin.token, {
      qty: 5,
      max: 10,
    });
    const res = await addToCart(app, customer.token, productId, 6).expect(400);
    expect(res.body.message).toBe('Only 5 units available');
  });

  it('first add must meet the minimum; repeat adds increment (unique cart+product)', async () => {
    const { productId } = await seedProduct(app, admin.token, {
      qty: 20,
      min: 3,
      max: 10,
      price: 1.25,
    });
    await addToCart(app, customer.token, productId, 2).expect(400);
    await addToCart(app, customer.token, productId, 3).expect(200);
    const res = await addToCart(app, customer.token, productId, 1).expect(200);

    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({
      quantity: 4,
      price: '1.25',
      lineTotal: '5.00',
      maxAllowedQuantity: 10,
      isAvailable: true,
    });
    expect(res.body).toMatchObject({
      itemCount: 4,
      subtotal: '5.00',
      grandTotal: '5.00',
    });
  });

  it('increment past the maximum is rolled back (quantity stays the same)', async () => {
    const { productId } = await seedProduct(app, admin.token, {
      qty: 50,
      max: 5,
    });
    await addToCart(app, customer.token, productId, 4).expect(200);
    await addToCart(app, customer.token, productId, 2).expect(400);
    const cart = await http(app)
      .get(`${API}/cart`)
      .set(bearer(customer.token))
      .expect(200);
    expect(cart.body.items[0].quantity).toBe(4);
  });

  it('PATCH sets an absolute quantity (retry safe) and 0 removes the item', async () => {
    const { productId } = await seedProduct(app, admin.token, { qty: 20 });
    const added = await addToCart(app, customer.token, productId, 2).expect(
      200,
    );
    const itemId = added.body.items[0].id as string;

    for (let i = 0; i < 2; i++) {
      const res = await http(app)
        .patch(`${API}/cart/items/${itemId}`)
        .set(bearer(customer.token))
        .send({ quantity: 5 })
        .expect(200);
      expect(res.body.items[0].quantity).toBe(5);
    }
    const removed = await http(app)
      .patch(`${API}/cart/items/${itemId}`)
      .set(bearer(customer.token))
      .send({ quantity: 0 })
      .expect(200);
    expect(removed.body.items).toEqual([]);
  });

  it("another customer's cart item → 404", async () => {
    const { productId } = await seedProduct(app, admin.token);
    const added = await addToCart(app, customer.token, productId, 1).expect(
      200,
    );
    const other = await registerCustomer(app);
    const itemId = added.body.items[0].id as string;
    await http(app)
      .patch(`${API}/cart/items/${itemId}`)
      .set(bearer(other.token))
      .send({ quantity: 2 })
      .expect(404);
    await http(app)
      .delete(`${API}/cart/items/${itemId}`)
      .set(bearer(other.token))
      .expect(404);
  });

  it('out of stock → 400; inactive product → 404', async () => {
    const empty = await seedProduct(app, admin.token, { qty: 0 });
    await addToCart(app, customer.token, empty.productId, 1).expect(400);

    const inactive = await seedProduct(app, admin.token);
    await http(app)
      .patch(`${API}/admin/products/${inactive.productId}`)
      .set(bearer(admin.token))
      .send({ isActive: false })
      .expect(200);
    await addToCart(app, customer.token, inactive.productId, 1).expect(404);
  });

  it('the cart does not reserve stock and always shows the current product price', async () => {
    const { productId, inventoryId } = await seedProduct(app, admin.token, {
      qty: 10,
      price: 2,
    });
    await addToCart(app, customer.token, productId, 3).expect(200);

    const inv = await http(app)
      .get(`${API}/admin/inventory`)
      .set(bearer(admin.token))
      .expect(200);
    expect(
      inv.body.data.find((i: { id: string }) => i.id === inventoryId).qtyOnHand,
    ).toBe(10);

    await http(app)
      .patch(`${API}/admin/products/${productId}`)
      .set(bearer(admin.token))
      .send({ price: 3 })
      .expect(200);
    const cart = await http(app)
      .get(`${API}/cart`)
      .set(bearer(customer.token))
      .expect(200);
    expect(cart.body).toMatchObject({ subtotal: '9.00' });
  });

  it('DELETE /cart and DELETE /cart/items/:id return 204', async () => {
    const { productId } = await seedProduct(app, admin.token);
    const added = await addToCart(app, customer.token, productId, 1).expect(
      200,
    );
    await http(app)
      .delete(`${API}/cart/items/${added.body.items[0].id}`)
      .set(bearer(customer.token))
      .expect(204);
    await addToCart(app, customer.token, productId, 1).expect(200);
    await http(app)
      .delete(`${API}/cart`)
      .set(bearer(customer.token))
      .expect(204);
    const cart = await http(app)
      .get(`${API}/cart`)
      .set(bearer(customer.token))
      .expect(200);
    expect(cart.body.items).toEqual([]);
  });
});
