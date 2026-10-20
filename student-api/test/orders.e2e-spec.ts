import { INestApplication } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { DatabaseService } from '../src/database/database.service';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  registerCustomer,
} from './helpers/auth';
import {
  addToCart,
  placeOrder,
  seedProduct,
  SHIPPING_ADDRESS,
} from './helpers/catalog';
import { payOrder } from './helpers/payments';
import { createTestApp, resetDatabase } from './helpers/test-app';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let admin: ITestUser;
  let customer: ITestUser;

  const qtyOf = async (inventoryId: string) =>
    (await db.inventory.findUniqueOrThrow({ where: { id: inventoryId } }))
      .qtyOnHand;

  /** Customer ke cart mein product dal kar order place */
  async function orderOf(user: ITestUser, productId: string, quantity = 1) {
    await addToCart(app, user.token, productId, quantity).expect(200);
    const res = await placeOrder(app, user.token).expect(201);
    return res.body as { id: string; total: string };
  }

  async function confirmedOrder(
    user: ITestUser,
    productId: string,
    quantity = 1,
  ) {
    const order = await orderOf(user, productId, quantity);
    await payOrder(app, user.token, order.id);
    return order;
  }

  const setStatus = (orderId: string, status: string) =>
    http(app)
      .patch(`${API}/admin/orders/${orderId}/status`)
      .set(bearer(admin.token))
      .send({ status });

  beforeAll(async () => {
    app = await createTestApp();
    db = app.get(DatabaseService);
  });

  beforeEach(async () => {
    await resetDatabase(app);
    admin = await createAdmin(app);
    customer = await registerCustomer(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('checkout (one transaction)', () => {
    it('creates PENDING/UNPAID with server prices; stock deducted, CONSUMED ledger, cart cleared', async () => {
      const a = await seedProduct(app, admin.token, { qty: 10, price: 1.99 });
      const b = await seedProduct(app, admin.token, { qty: 5, price: 5 });
      await addToCart(app, customer.token, a.productId, 2).expect(200);
      await addToCart(app, customer.token, b.productId, 1).expect(200);

      const res = await placeOrder(app, customer.token).expect(201);

      expect(res.body).toMatchObject({
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        deliveryType: 'DELIVERY',
        subtotal: '8.98',
        shippingCost: '0.00',
        total: '8.98',
        address: SHIPPING_ADDRESS,
      });
      expect(res.body.orderNumber).toMatch(/^ORD-\d{4}-\d{6}$/);
      const expiresIn =
        new Date(res.body.paymentExpiresAt).getTime() - Date.now();
      expect(expiresIn).toBeGreaterThan(4 * 60_000);
      expect(expiresIn).toBeLessThanOrEqual(5 * 60_000);

      expect(await qtyOf(a.inventoryId)).toBe(8);
      expect(await qtyOf(b.inventoryId)).toBe(4);
      const consumed = await db.inventoryTransaction.findMany({
        where: { type: TransactionType.CONSUMED },
      });
      expect(consumed.map((t) => t.quantity).sort()).toEqual([1, 2]);
      expect(consumed.every((t) => t.orderItemId)).toBe(true);

      const cart = await http(app)
        .get(`${API}/cart`)
        .set(bearer(customer.token))
        .expect(200);
      expect(cart.body.items).toEqual([]);
    });

    it('an immediate second order → 400 "Cart is empty" (no duplicate order)', async () => {
      const p = await seedProduct(app, admin.token);
      await orderOf(customer, p.productId);
      const res = await placeOrder(app, customer.token).expect(400);
      expect(res.body.message).toBe('Cart is empty. Cannot create order.');
      expect(await db.order.count()).toBe(1);
    });

    it('client cannot send a price or total (whitelist)', async () => {
      const p = await seedProduct(app, admin.token);
      await addToCart(app, customer.token, p.productId, 1).expect(200);
      await placeOrder(app, customer.token, {
        deliveryType: 'DELIVERY',
        shippingAddress: SHIPPING_ADDRESS,
        total: '0.01',
      }).expect(400);
    });

    it('rolls back everything when one item is short on stock', async () => {
      const a = await seedProduct(app, admin.token, { qty: 10 });
      const b = await seedProduct(app, admin.token, { qty: 2 });
      await addToCart(app, customer.token, a.productId, 2).expect(200);
      await addToCart(app, customer.token, b.productId, 2).expect(200);
      // Cart stock reserve nahi karta — beech mein stock kam ho gaya
      await http(app)
        .post(`${API}/admin/inventory/adjustments`)
        .set(bearer(admin.token))
        .send({ inventoryId: b.inventoryId, quantity: -1, reason: 'DAMAGE' })
        .expect(201);

      const res = await placeOrder(app, customer.token).expect(400);
      expect(res.body.message).toBe(
        'Not enough stock. Requested: 2, Available: 1.',
      );

      expect(await qtyOf(a.inventoryId)).toBe(10);
      expect(await qtyOf(b.inventoryId)).toBe(1);
      expect(await db.order.count()).toBe(0);
      expect(
        await db.inventoryTransaction.count({
          where: { type: TransactionType.CONSUMED },
        }),
      ).toBe(0);
      const cart = await http(app)
        .get(`${API}/cart`)
        .set(bearer(customer.token))
        .expect(200);
      expect(cart.body.items).toHaveLength(2);
    });

    it('does not oversell the last unit (2 customers, 1 unit, parallel)', async () => {
      const p = await seedProduct(app, admin.token, { qty: 1 });
      const other = await registerCustomer(app);
      await addToCart(app, customer.token, p.productId, 1).expect(200);
      await addToCart(app, other.token, p.productId, 1).expect(200);

      const results = await Promise.all([
        placeOrder(app, customer.token),
        placeOrder(app, other.token),
      ]);

      expect(results.map((r) => r.status).sort()).toEqual([201, 400]);
      expect(await qtyOf(p.inventoryId)).toBe(0);
      expect(await db.order.count()).toBe(1);
    });

    it('same customer, two parallel orders from one cart → one order, one "Cart is empty"', async () => {
      const p = await seedProduct(app, admin.token, { qty: 10 });
      await addToCart(app, customer.token, p.productId, 2).expect(200);

      const results = await Promise.all([
        placeOrder(app, customer.token),
        placeOrder(app, customer.token),
      ]);

      expect(results.map((r) => r.status).sort()).toEqual([201, 400]);
      expect(results.find((r) => r.status === 400)?.body.message).toBe(
        'Cart is empty. Cannot create order.',
      );
      expect(await qtyOf(p.inventoryId)).toBe(8);
    });

    it('PICKUP needs a future pickupScheduledAt and no address', async () => {
      const p = await seedProduct(app, admin.token);
      await addToCart(app, customer.token, p.productId, 1).expect(200);
      await placeOrder(app, customer.token, { deliveryType: 'PICKUP' }).expect(
        400,
      );
      await placeOrder(app, customer.token, {
        deliveryType: 'PICKUP',
        pickupScheduledAt: new Date(Date.now() + 86_400_000).toISOString(),
        shippingAddress: SHIPPING_ADDRESS,
      }).expect(400);

      const res = await placeOrder(app, customer.token, {
        deliveryType: 'PICKUP',
        pickupScheduledAt: new Date(Date.now() + 86_400_000).toISOString(),
      }).expect(201);
      expect(res.body).toMatchObject({ deliveryType: 'PICKUP', address: null });
    });

    it('DELIVERY with a saved address snapshots it; someone else’s address → 404', async () => {
      const p = await seedProduct(app, admin.token);
      const saved = await http(app)
        .post(`${API}/addresses`)
        .set(bearer(customer.token))
        .send({ ...SHIPPING_ADDRESS, addressLine: '10 Downing Street' })
        .expect(201);

      const other = await registerCustomer(app);
      await addToCart(app, other.token, p.productId, 1).expect(200);
      await placeOrder(app, other.token, {
        deliveryType: 'DELIVERY',
        addressId: saved.body.id,
      }).expect(404);

      await addToCart(app, customer.token, p.productId, 1).expect(200);
      const res = await placeOrder(app, customer.token, {
        deliveryType: 'DELIVERY',
        addressId: saved.body.id,
      }).expect(201);
      expect(res.body.address.addressLine).toBe('10 Downing Street');
    });

    it('admin cannot place an order (403)', async () => {
      await placeOrder(app, admin.token).expect(403);
    });
  });

  describe('ownership (IDOR)', () => {
    it("customer B cannot read or cancel A's order (404) and only sees own orders", async () => {
      const p = await seedProduct(app, admin.token);
      const order = await orderOf(customer, p.productId);
      const other = await registerCustomer(app);

      await http(app)
        .get(`${API}/orders/me/${order.id}`)
        .set(bearer(other.token))
        .expect(404);
      await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(other.token))
        .send({ reason: 'CHANGED_MIND' })
        .expect(404);

      const otherList = await http(app)
        .get(`${API}/orders/me`)
        .set(bearer(other.token))
        .expect(200);
      expect(otherList.body.data).toEqual([]);
      const ownList = await http(app)
        .get(`${API}/orders/me`)
        .set(bearer(customer.token))
        .expect(200);
      expect(ownList.body.data).toMatchObject([{ id: order.id, itemCount: 1 }]);
    });

    it('customers cannot use admin order routes (403)', async () => {
      await http(app)
        .get(`${API}/admin/orders`)
        .set(bearer(customer.token))
        .expect(403);
    });
  });

  describe('customer cancellation', () => {
    it('unpaid PENDING → CANCELLED with exact stock restored and RELEASED rows', async () => {
      const p = await seedProduct(app, admin.token, { qty: 10 });
      const order = await orderOf(customer, p.productId, 3);
      expect(await qtyOf(p.inventoryId)).toBe(7);

      const res = await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'CHANGED_MIND' })
        .expect(200);
      expect(res.body).toMatchObject({
        status: 'CANCELLED',
        cancellationReason: 'CHANGED_MIND',
      });
      expect(await qtyOf(p.inventoryId)).toBe(10);
      expect(
        await db.inventoryTransaction.count({
          where: { type: TransactionType.RELEASED },
        }),
      ).toBe(1);

      // Dobara cancel safe — 200, stock dobara nahi badhta
      await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'CHANGED_MIND' })
        .expect(200);
      expect(await qtyOf(p.inventoryId)).toBe(10);
    });

    it('OTHER needs a note', async () => {
      const p = await seedProduct(app, admin.token);
      const order = await orderOf(customer, p.productId);
      await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'OTHER' })
        .expect(400);
      await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'OTHER', note: 'Bought elsewhere' })
        .expect(200);
    });

    it('PROCESSING → 400', async () => {
      const p = await seedProduct(app, admin.token);
      const order = await confirmedOrder(customer, p.productId);
      await setStatus(order.id, 'PROCESSING').expect(200);

      const res = await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'CHANGED_MIND' })
        .expect(400);
      expect(res.body.message).toBe(
        'Order cannot be cancelled once it is in Processing status. Please contact support.',
      );
    });
  });

  describe('admin status workflow', () => {
    it('CONFIRMED → PROCESSING → READY_FOR_DELIVERY → DELIVERED with timestamps', async () => {
      const p = await seedProduct(app, admin.token);
      const order = await confirmedOrder(customer, p.productId);

      await setStatus(order.id, 'PROCESSING').expect(200);
      await setStatus(order.id, 'READY_FOR_DELIVERY').expect(200);
      const res = await setStatus(order.id, 'DELIVERED').expect(200);
      expect(res.body.status).toBe('DELIVERED');
      expect(res.body.processedAt).not.toBeNull();
      expect(res.body.readyAt).not.toBeNull();
      expect(res.body.deliveredAt).not.toBeNull();

      // Terminal: DELIVERED ke baad kuch nahi; admin cancel bhi nahi
      await setStatus(order.id, 'PROCESSING').expect(400);
      await http(app)
        .patch(`${API}/admin/orders/${order.id}/cancel`)
        .set(bearer(admin.token))
        .send({ reason: 'CUSTOMER_REQUEST' })
        .expect(400);
    });

    it('rejects invalid transitions with 400', async () => {
      const p = await seedProduct(app, admin.token);
      const pending = await orderOf(customer, p.productId);
      await setStatus(pending.id, 'CONFIRMED').expect(400); // sirf payment se
      await setStatus(pending.id, 'PROCESSING').expect(400);

      const confirmed = await confirmedOrder(customer, p.productId);
      await setStatus(confirmed.id, 'DELIVERED').expect(400);
      await setStatus(confirmed.id, 'CANCELLED').expect(400);
      await setStatus(confirmed.id, 'PROCESSING').expect(200);
      // DELIVERY order ko READY_FOR_PICKUP nahi
      await setStatus(confirmed.id, 'READY_FOR_PICKUP').expect(400);
    });

    it('two admins updating at once: one wins, the other gets 409/400', async () => {
      const p = await seedProduct(app, admin.token);
      const order = await confirmedOrder(customer, p.productId);
      const results = await Promise.all([
        setStatus(order.id, 'PROCESSING'),
        setStatus(order.id, 'PROCESSING'),
      ]);
      const statuses = results.map((r) => r.status).sort();
      expect(statuses[0]).toBe(200);
      expect([400, 409]).toContain(statuses[1]);
    });

    it('admin list: paginated, filter by status and search by order number', async () => {
      const p = await seedProduct(app, admin.token);
      const first = await orderOf(customer, p.productId);
      await confirmedOrder(customer, p.productId);

      const pending = await http(app)
        .get(`${API}/admin/orders?status=PENDING`)
        .set(bearer(admin.token))
        .expect(200);
      expect(pending.body.data.map((o: { id: string }) => o.id)).toEqual([
        first.id,
      ]);
      expect(pending.body.data[0].customer.email).toBe(customer.email);

      const detail = await http(app)
        .get(`${API}/admin/orders/${first.id}`)
        .set(bearer(admin.token))
        .expect(200);
      const search = await http(app)
        .get(`${API}/admin/orders?search=${detail.body.orderNumber}`)
        .set(bearer(admin.token))
        .expect(200);
      expect(search.body.meta.total).toBe(1);
    });
  });
});
