import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import { PaymentTimeoutCron } from '../src/modules/orders/cron/payment-timeout.cron';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  login,
} from './helpers/auth';
import { addToCart, placeOrder, seedProduct } from './helpers/catalog';
import { payOrder } from './helpers/payments';
import { createTestApp, resetDatabase } from './helpers/test-app';

/** FLOW-MD 12 §5 — 4 critical workflows, poori API ke through */
describe('Critical workflows (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let admin: ITestUser;

  const qtyOf = async (inventoryId: string) =>
    (await db.inventory.findUniqueOrThrow({ where: { id: inventoryId } }))
      .qtyOnHand;

  async function newCustomerToken(email: string): Promise<string> {
    await http(app)
      .post(`${API}/auth/register`)
      .send({ name: 'Flow Customer', email, password: 'FlowPass123' })
      .expect(201);
    return login(app, email, 'FlowPass123');
  }

  beforeAll(async () => {
    app = await createTestApp();
    db = app.get(DatabaseService);
  });

  beforeEach(async () => {
    await resetDatabase(app);
    admin = await createAdmin(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('1) register → login → cart → DELIVERY checkout → mock pay → CONFIRMED in history', async () => {
    const { productId } = await seedProduct(app, admin.token, {
      qty: 10,
      price: 3.2,
    });
    const token = await newCustomerToken('flow1@test.local');

    await addToCart(app, token, productId, 2).expect(200);
    const order = await placeOrder(app, token).expect(201);
    const paid = await payOrder(app, token, order.body.id);
    expect(paid.status).toBe('PAID');

    const history = await http(app)
      .get(`${API}/orders/me`)
      .set(bearer(token))
      .expect(200);
    expect(history.body.data).toMatchObject([
      {
        id: order.body.id,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        total: '6.40',
      },
    ]);
  });

  it('2) admin login → PROCESSING → READY_FOR_DELIVERY → DELIVERED', async () => {
    const { productId } = await seedProduct(app, admin.token);
    const token = await newCustomerToken('flow2@test.local');
    await addToCart(app, token, productId, 1).expect(200);
    const order = await placeOrder(app, token).expect(201);
    await payOrder(app, token, order.body.id);

    const adminToken = await login(app, admin.email, admin.password);
    for (const status of ['PROCESSING', 'READY_FOR_DELIVERY', 'DELIVERED']) {
      const res = await http(app)
        .patch(`${API}/admin/orders/${order.body.id}/status`)
        .set(bearer(adminToken))
        .send({ status })
        .expect(200);
      expect(res.body.status).toBe(status);
    }
    const detail = await http(app)
      .get(`${API}/orders/me/${order.body.id}`)
      .set(bearer(token))
      .expect(200);
    expect(detail.body.status).toBe('DELIVERED');
  });

  it('3) customer cancels a paid CONFIRMED order → REFUND_PENDING → refund → CANCELLED, stock restored', async () => {
    const { productId, inventoryId } = await seedProduct(app, admin.token, {
      qty: 10,
    });
    const token = await newCustomerToken('flow3@test.local');
    await addToCart(app, token, productId, 4).expect(200);
    const order = await placeOrder(app, token).expect(201);
    await payOrder(app, token, order.body.id);
    expect(await qtyOf(inventoryId)).toBe(6);

    const res = await http(app)
      .patch(`${API}/orders/me/${order.body.id}/cancel`)
      .set(bearer(token))
      .send({ reason: 'FOUND_BETTER_PRICE' })
      .expect(200);

    expect(res.body).toMatchObject({
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
    });
    expect(await qtyOf(inventoryId)).toBe(10);
  });

  it('4) unpaid order → timeout cron → CANCELLED, stock restored', async () => {
    const { productId, inventoryId } = await seedProduct(app, admin.token, {
      qty: 10,
    });
    const token = await newCustomerToken('flow4@test.local');
    await addToCart(app, token, productId, 5).expect(200);
    const order = await placeOrder(app, token).expect(201);
    expect(await qtyOf(inventoryId)).toBe(5);

    // 5 minute guzar gaye (paymentExpiresAt peeche kar diya)
    await db.order.update({
      where: { id: order.body.id },
      data: { paymentExpiresAt: new Date(Date.now() - 1000) },
    });
    await app.get(PaymentTimeoutCron).handle();

    const detail = await http(app)
      .get(`${API}/orders/me/${order.body.id}`)
      .set(bearer(token))
      .expect(200);
    expect(detail.body).toMatchObject({
      status: 'CANCELLED',
      cancellationReason: 'PAYMENT_TIMEOUT',
    });
    expect(await qtyOf(inventoryId)).toBe(10);
  });
});
