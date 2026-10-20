import { INestApplication } from '@nestjs/common';
import { CancellationReason, OrderStatus, PaymentStatus } from '@prisma/client';
import { DatabaseService } from '../src/database/database.service';
import {
  PAYMENT_GATEWAY,
  type PaymentGateway,
} from '../src/infrastructure/payment/payment-gateway';
import { PaymentTimeoutCron } from '../src/modules/orders/cron/payment-timeout.cron';
import { RefundRetryCron } from '../src/modules/payments/cron/refund-retry.cron';
import { PaymentsDbService } from '../src/modules/payments/payments.db.service';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  registerCustomer,
} from './helpers/auth';
import { addToCart, placeOrder, seedProduct } from './helpers/catalog';
import { payOrder, sendWebhook } from './helpers/payments';
import { createTestApp, resetDatabase } from './helpers/test-app';

describe('Payments, refunds and payment timeout (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let admin: ITestUser;
  let customer: ITestUser;

  const qtyOf = async (inventoryId: string) =>
    (await db.inventory.findUniqueOrThrow({ where: { id: inventoryId } }))
      .qtyOnHand;
  const orderRow = (id: string) =>
    db.order.findUniqueOrThrow({ where: { id } });
  const userRow = (id: string) => db.user.findUniqueOrThrow({ where: { id } });

  async function pendingOrder(quantity = 1, price = 4.5) {
    const seeded = await seedProduct(app, admin.token, { qty: 10, price });
    await addToCart(app, customer.token, seeded.productId, quantity).expect(
      200,
    );
    const res = await placeOrder(app, customer.token).expect(201);
    return { order: res.body as { id: string; total: string }, ...seeded };
  }

  const initiate = (orderId: string, token = customer.token) =>
    http(app)
      .post(`${API}/payments/initiate`)
      .set(bearer(token))
      .send({ orderId });

  beforeAll(async () => {
    app = await createTestApp();
    db = app.get(DatabaseService);
  });

  beforeEach(async () => {
    await resetDatabase(app);
    admin = await createAdmin(app);
    customer = await registerCustomer(app);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('initiate', () => {
    it('3× initiate → one payment row with the same id and the server total', async () => {
      const { order } = await pendingOrder(2, 4.5);
      const results: { paymentId: string; amount: string }[] = [];
      for (let i = 0; i < 3; i++) {
        results.push((await initiate(order.id).expect(200)).body);
      }

      expect(new Set(results.map((r) => r.paymentId)).size).toBe(1);
      expect(results[0].amount).toBe('9.00');
      expect(await db.payment.count()).toBe(1);
    });

    it('parallel initiates still create a single payment', async () => {
      const { order } = await pendingOrder();
      const results = await Promise.all([
        initiate(order.id),
        initiate(order.id),
      ]);
      expect(results.map((r) => r.status)).toEqual([200, 200]);
      expect(await db.payment.count()).toBe(1);
    });

    it("another customer's order or a non-PENDING order → 404", async () => {
      const { order } = await pendingOrder();
      const other = await registerCustomer(app);
      await initiate(order.id, other.token).expect(404);

      await payOrder(app, customer.token, order.id);
      await initiate(order.id).expect(404);
    });
  });

  describe('confirmation via signed webhook', () => {
    it('mock success → payment PAID, order CONFIRMED, user stats updated once even if retried', async () => {
      const { order } = await pendingOrder(2, 4.5);
      const paid = await payOrder(app, customer.token, order.id);
      expect(paid.status).toBe('PAID');

      // mock-complete dobara — retry safe
      await http(app)
        .post(`${API}/payments/${paid.paymentId}/mock-complete`)
        .set(bearer(customer.token))
        .send({ outcome: 'succeeded' })
        .expect(200);

      const row = await orderRow(order.id);
      expect(row.status).toBe(OrderStatus.CONFIRMED);
      expect(row.paymentStatus).toBe(PaymentStatus.PAID);
      expect(row.confirmedAt).not.toBeNull();
      const user = await userRow(customer.id);
      expect(user.totalOrders).toBe(1);
      expect(user.totalSpent.toFixed(2)).toBe('9.00');
    });

    it('the same webhook event delivered twice is processed once', async () => {
      const { order } = await pendingOrder();
      const { body } = await initiate(order.id).expect(200);
      const event = {
        id: 'evt_dup',
        type: 'payment.succeeded',
        gatewayRef: body.gatewayRef,
      };

      await sendWebhook(app, event).expect(200);
      await sendWebhook(app, event).expect(200);

      expect((await userRow(customer.id)).totalOrders).toBe(1);
      expect((await orderRow(order.id)).status).toBe(OrderStatus.CONFIRMED);
    });

    it('invalid signature → 400 and nothing changes', async () => {
      const { order } = await pendingOrder();
      const { body } = await initiate(order.id).expect(200);
      const res = await sendWebhook(
        app,
        { id: 'evt_x', type: 'payment.succeeded', gatewayRef: body.gatewayRef },
        'a'.repeat(64),
      ).expect(400);
      expect(res.body.message).toBe('Invalid webhook signature');

      expect((await db.payment.findFirstOrThrow()).status).toBe(
        PaymentStatus.UNPAID,
      );
      expect((await orderRow(order.id)).status).toBe(OrderStatus.PENDING);
    });

    it('an event for an unknown payment is acknowledged and ignored', async () => {
      await sendWebhook(app, {
        id: 'evt_unknown',
        type: 'payment.succeeded',
        gatewayRef: 'mock_pi_does_not_exist',
      }).expect(200);
    });

    it('failed payment → FAILED, order stays PENDING, then a retry can succeed', async () => {
      const { order } = await pendingOrder();
      const failed = await payOrder(app, customer.token, order.id, 'failed');
      expect(failed.status).toBe('FAILED');
      expect((await orderRow(order.id)).status).toBe(OrderStatus.PENDING);

      const retry = await http(app)
        .post(`${API}/payments/${failed.paymentId}/mock-complete`)
        .set(bearer(customer.token))
        .send({ outcome: 'succeeded' })
        .expect(200);
      expect(retry.body.status).toBe('PAID');
      expect((await orderRow(order.id)).status).toBe(OrderStatus.CONFIRMED);
    });
  });

  describe('refunds', () => {
    it('paid order cancelled → REFUND_PENDING → refunded → CANCELLED/REFUNDED; stats and stock restored', async () => {
      const { order, inventoryId } = await pendingOrder(2, 4.5);
      await payOrder(app, customer.token, order.id);
      expect(await qtyOf(inventoryId)).toBe(8);

      const res = await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'CHANGED_MIND' })
        .expect(200);

      expect(res.body).toMatchObject({
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
      });
      expect(res.body.payments[0]).toMatchObject({ status: 'REFUNDED' });
      expect(await qtyOf(inventoryId)).toBe(10);
      const user = await userRow(customer.id);
      expect(user.totalOrders).toBe(0);
      expect(user.totalSpent.toFixed(2)).toBe('0.00');
    });

    it('gateway outage keeps the order REFUND_PENDING until the refund-retry cron succeeds', async () => {
      const { order } = await pendingOrder();
      await payOrder(app, customer.token, order.id);
      jest
        .spyOn(app.get<PaymentGateway>(PAYMENT_GATEWAY), 'refund')
        .mockRejectedValueOnce(new Error('gateway down'));

      const res = await http(app)
        .patch(`${API}/admin/orders/${order.id}/cancel`)
        .set(bearer(admin.token))
        .send({ reason: 'OUT_OF_STOCK' })
        .expect(200);
      expect(res.body).toMatchObject({
        status: 'REFUND_PENDING',
        paymentStatus: 'PAID',
      });

      await expect(app.get(RefundRetryCron).handle()).resolves.toBe(1);
      const row = await orderRow(order.id);
      expect(row.status).toBe(OrderStatus.CANCELLED);
      expect(row.paymentStatus).toBe(PaymentStatus.REFUNDED);
      expect((await userRow(customer.id)).totalSpent.toFixed(2)).toBe('0.00');

      // Dobara cron — kuch karne ko nahi
      await expect(app.get(RefundRetryCron).handle()).resolves.toBe(0);
    });

    it('a late payment on an already cancelled order is refunded automatically', async () => {
      const { order } = await pendingOrder();
      const { body } = await initiate(order.id).expect(200);
      // Best-effort payment cancel fail ho gaya — payment UNPAID reh gayi
      jest
        .spyOn(app.get(PaymentsDbService), 'cancelUnpaidPayments')
        .mockRejectedValueOnce(new Error('gateway down'));
      await http(app)
        .patch(`${API}/orders/me/${order.id}/cancel`)
        .set(bearer(customer.token))
        .send({ reason: 'CHANGED_MIND' })
        .expect(200);
      expect((await db.payment.findFirstOrThrow()).status).toBe(
        PaymentStatus.UNPAID,
      );

      // Ab payment succeed hoti hai
      await sendWebhook(app, {
        id: 'evt_late',
        type: 'payment.succeeded',
        gatewayRef: body.gatewayRef,
      }).expect(200);

      const payment = await db.payment.findFirstOrThrow();
      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      const row = await orderRow(order.id);
      expect(row.status).toBe(OrderStatus.CANCELLED);
      expect(row.paymentStatus).toBe(PaymentStatus.REFUNDED);
      expect((await userRow(customer.id)).totalOrders).toBe(0);
    });
  });

  describe('payment timeout cron', () => {
    it('cancels an expired unpaid order with PAYMENT_TIMEOUT, restores stock, cancels the payment', async () => {
      const { order, inventoryId } = await pendingOrder(3);
      await initiate(order.id).expect(200);
      const fresh = await pendingOrder(1);
      await db.order.update({
        where: { id: order.id },
        data: { paymentExpiresAt: new Date(Date.now() - 60_000) },
      });

      await expect(app.get(PaymentTimeoutCron).handle()).resolves.toBe(1);

      const row = await orderRow(order.id);
      expect(row.status).toBe(OrderStatus.CANCELLED);
      expect(row.cancellationReason).toBe(CancellationReason.PAYMENT_TIMEOUT);
      expect(await qtyOf(inventoryId)).toBe(10);
      expect(
        (await db.payment.findFirstOrThrow({ where: { orderId: order.id } }))
          .status,
      ).toBe(PaymentStatus.CANCELED);
      // Jis order ki expiry nahi guzri woh PENDING hi rehta hai
      expect((await orderRow(fresh.order.id)).status).toBe(OrderStatus.PENDING);
    });

    it('skips an order that was paid in the meantime', async () => {
      const { order } = await pendingOrder();
      await payOrder(app, customer.token, order.id);
      await db.order.update({
        where: { id: order.id },
        data: { paymentExpiresAt: new Date(Date.now() - 60_000) },
      });

      await expect(app.get(PaymentTimeoutCron).handle()).resolves.toBe(0);
      expect((await orderRow(order.id)).status).toBe(OrderStatus.CONFIRMED);
    });
  });
});
