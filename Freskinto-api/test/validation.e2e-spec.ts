import { INestApplication } from '@nestjs/common';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  registerCustomer,
} from './helpers/auth';
import { createTestApp, resetDatabase } from './helpers/test-app';

/** Phase 6 — DTOs + global ValidationPipe (whitelist, forbidNonWhitelisted, transform) */
describe('Validation (e2e)', () => {
  let app: INestApplication;
  let admin: ITestUser;
  let customer: ITestUser;

  beforeAll(async () => {
    app = await createTestApp();
    await resetDatabase(app);
    admin = await createAdmin(app);
    customer = await registerCustomer(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('unknown body field → 400 (mass assignment blocked)', async () => {
    const res = await http(app)
      .post(`${API}/admin/categories`)
      .set(bearer(admin.token))
      .send({ name: 'Fruits', slug: 'hacked' })
      .expect(400);
    expect(res.body).toEqual({
      statusCode: 400,
      message: ['property slug should not exist'],
      error: 'Bad Request',
    });
  });

  it('invalid UUID path param → 400', async () => {
    await http(app).get(`${API}/products/not-a-uuid`).expect(400);
    await http(app)
      .get(`${API}/orders/me/123`)
      .set(bearer(customer.token))
      .expect(400);
  });

  it.each(['500', '101', '0'])('limit=%s → 400', async (limit) => {
    await http(app).get(`${API}/products?limit=${limit}`).expect(400);
  });

  it('page must be ≥ 1 and numeric', async () => {
    await http(app).get(`${API}/products?page=0`).expect(400);
    await http(app).get(`${API}/products?page=abc`).expect(400);
  });

  it('add-to-cart quantity 0 → 400 with a message array', async () => {
    const res = await http(app)
      .post(`${API}/cart/items`)
      .set(bearer(customer.token))
      .send({
        productId: '7f1e2a1c-1d2b-4c3d-9e8f-0a1b2c3d4e5f',
        quantity: 0,
      })
      .expect(400);
    expect(res.body.message).toEqual(['quantity must not be less than 1']);
  });

  it('create order without deliveryType → 400', async () => {
    const res = await http(app)
      .post(`${API}/orders`)
      .set(bearer(customer.token))
      .send({})
      .expect(400);
    expect(Array.isArray(res.body.message)).toBe(true);
  });

  it('nested shippingAddress is validated and whitelisted too', async () => {
    await http(app)
      .post(`${API}/orders`)
      .set(bearer(customer.token))
      .send({
        deliveryType: 'DELIVERY',
        shippingAddress: {
          addressLine: '1 St',
          city: 'X',
          county: 'Y',
          postcode: 'Z',
          extra: 1,
        },
      })
      .expect(400);
  });

  it('sortBy is whitelisted (raw column names rejected)', async () => {
    await http(app).get(`${API}/products?sortBy=passwordHash`).expect(400);
    await http(app).get(`${API}/products?sortBy=price_asc`).expect(200);
  });

  it('enum query filters are validated', async () => {
    await http(app)
      .get(`${API}/admin/orders?status=SHIPPED`)
      .set(bearer(admin.token))
      .expect(400);
  });

  it('dateFrom after dateTo → 400', async () => {
    await http(app)
      .get(`${API}/admin/orders?dateFrom=2026-02-01&dateTo=2026-01-01`)
      .set(bearer(admin.token))
      .expect(400);
  });
});
