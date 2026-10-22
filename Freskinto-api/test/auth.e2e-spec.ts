import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { DatabaseService } from '../src/database/database.service';
import {
  API,
  bearer,
  createAdmin,
  http,
  ITestUser,
  login,
  registerCustomer,
} from './helpers/auth';
import { createTestApp, resetDatabase } from './helpers/test-app';

describe('Auth & authorization (e2e)', () => {
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

  describe('POST /auth/register', () => {
    it('creates a CUSTOMER with a bcrypt hash and never returns the hash', async () => {
      const res = await http(app)
        .post(`${API}/auth/register`)
        .send({
          name: '  Ali Khan ',
          email: ' Ali@Example.COM ',
          password: 'secret123',
        })
        .expect(201);

      expect(res.body).toMatchObject({
        name: 'Ali Khan',
        email: 'ali@example.com',
        role: 'CUSTOMER',
        isActive: true,
        totalSpent: '0.00',
      });
      expect(res.body).not.toHaveProperty('passwordHash');

      const row = await app
        .get(DatabaseService)
        .user.findUniqueOrThrow({ where: { email: 'ali@example.com' } });
      expect(row.role).toBe(UserRole.CUSTOMER);
      expect(row.passwordHash).toMatch(/^\$2[aby]\$12\$/);
      expect(row.passwordHash).not.toContain('secret123');
    });

    it('rejects a role field in the body (mass assignment) with 400', async () => {
      const res = await http(app)
        .post(`${API}/auth/register`)
        .send({
          name: 'Hacker',
          email: 'h@test.local',
          password: 'secret123',
          role: 'ADMIN',
        })
        .expect(400);
      expect(res.body.message).toEqual(['property role should not exist']);
    });

    it('returns 409 for an already registered email', async () => {
      await registerCustomer(app, { email: 'dup@test.local' });
      const res = await http(app)
        .post(`${API}/auth/register`)
        .send({ name: 'Again', email: 'DUP@test.local', password: 'secret123' })
        .expect(409);
      expect(res.body.message).toBe(
        'This email is already associated with another account.',
      );
    });

    it('validates password length (8-72) with 400', async () => {
      await http(app)
        .post(`${API}/auth/register`)
        .send({ name: 'Short', email: 's@test.local', password: 'short' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('returns the same 401 for an unknown email and a wrong password', async () => {
      const customer = await registerCustomer(app);

      const unknown = await http(app)
        .post(`${API}/auth/login`)
        .send({ email: 'nobody@test.local', password: 'whatever1' })
        .expect(401);
      const wrongPassword = await http(app)
        .post(`${API}/auth/login`)
        .send({ email: customer.email, password: 'wrong-password' })
        .expect(401);

      expect(unknown.body).toEqual(wrongPassword.body);
      expect(unknown.body.message).toBe('Invalid email or password');
    });

    it('returns accessToken + user with role from the database', async () => {
      const res = await http(app)
        .post(`${API}/auth/login`)
        .send({ email: admin.email, password: admin.password })
        .expect(200);
      expect(typeof res.body.accessToken).toBe('string');
      expect(res.body.user.role).toBe('ADMIN');
      expect(res.body.user.lastLoginAt).not.toBeNull();
    });
  });

  describe('global JWT guard', () => {
    it('protects routes by default (no token → 401)', async () => {
      const res = await http(app).get(`${API}/admin/customers`).expect(401);
      expect(res.body.message).toBe('Authorization header missing');
    });

    it('rejects a malformed Authorization header', async () => {
      const res = await http(app)
        .get(`${API}/auth/me`)
        .set('Authorization', 'Token abc')
        .expect(401);
      expect(res.body.message).toBe('Invalid authorization header format');
    });

    it('rejects an invalid token', async () => {
      const res = await http(app)
        .get(`${API}/auth/me`)
        .set(bearer('not-a-real-token'))
        .expect(401);
      expect(res.body.message).toBe('Invalid authentication token');
    });

    it('rejects an expired token', async () => {
      const expired = await app
        .get(JwtService)
        .signAsync({ sub: admin.id, role: 'ADMIN' }, { expiresIn: -10 });
      const res = await http(app)
        .get(`${API}/auth/me`)
        .set(bearer(expired))
        .expect(401);
      expect(res.body.message).toBe('Token has expired. Please login again.');
    });

    it('GET /auth/me returns the current user without passwordHash', async () => {
      const customer = await registerCustomer(app);
      const res = await http(app)
        .get(`${API}/auth/me`)
        .set(bearer(customer.token))
        .expect(200);
      expect(res.body).toMatchObject({ id: customer.id, role: 'CUSTOMER' });
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('health stays public', async () => {
      await http(app).get(`${API}/health`).expect(200);
    });
  });

  describe('roles', () => {
    it('customer → admin route returns 403', async () => {
      const customer = await registerCustomer(app);
      const res = await http(app)
        .get(`${API}/admin/customers`)
        .set(bearer(customer.token))
        .expect(403);
      expect(res.body.message).toBe('Insufficient permissions');
    });

    it('admin can list customers (data + meta)', async () => {
      await registerCustomer(app);
      await registerCustomer(app);
      const res = await http(app)
        .get(`${API}/admin/customers?page=1&limit=1`)
        .set(bearer(admin.token))
        .expect(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].role).toBe('CUSTOMER');
      expect(res.body.meta).toEqual({
        total: 2,
        currentPage: 1,
        limit: 1,
        pages: 2,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });
  });

  describe('customer status', () => {
    it('deactivated customer: old token → 403 and login → 403', async () => {
      const customer = await registerCustomer(app);
      await http(app)
        .patch(`${API}/admin/customers/${customer.id}/status`)
        .set(bearer(admin.token))
        .send({ isActive: false })
        .expect(200);

      const me = await http(app)
        .get(`${API}/auth/me`)
        .set(bearer(customer.token))
        .expect(403);
      expect(me.body.message).toBe(
        'User account is deactivated. Please contact support.',
      );
      await http(app)
        .post(`${API}/auth/login`)
        .send({ email: customer.email, password: customer.password })
        .expect(403);

      // Dobara activate → login phir se kaam karta hai
      await http(app)
        .patch(`${API}/admin/customers/${customer.id}/status`)
        .set(bearer(admin.token))
        .send({ isActive: true })
        .expect(200);
      await login(app, customer.email, customer.password);
    });

    it('admin cannot change own status (400)', async () => {
      await http(app)
        .patch(`${API}/admin/customers/${admin.id}/status`)
        .set(bearer(admin.token))
        .send({ isActive: false })
        .expect(400);
    });

    it('unknown customer → 404, invalid uuid → 400', async () => {
      await http(app)
        .patch(
          `${API}/admin/customers/7f1e2a1c-1d2b-4c3d-9e8f-0a1b2c3d4e5f/status`,
        )
        .set(bearer(admin.token))
        .send({ isActive: false })
        .expect(404);
      await http(app)
        .patch(`${API}/admin/customers/not-a-uuid/status`)
        .set(bearer(admin.token))
        .send({ isActive: false })
        .expect(400);
    });
  });

  describe('single admin (DB constraint)', () => {
    it('a second ADMIN cannot be inserted', async () => {
      await expect(
        app.get(DatabaseService).user.create({
          data: {
            email: 'second-admin@test.local',
            name: 'Second Admin',
            role: UserRole.ADMIN,
            passwordHash: 'x',
          },
        }),
      ).rejects.toMatchObject({ code: 'P2002' });
    });
  });
});

describe('Auth rate limit (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp({ throttle: true });
    await resetDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows 10 login attempts per minute per IP, then 429', async () => {
    for (let i = 0; i < 10; i++) {
      await http(app)
        .post(`${API}/auth/login`)
        .send({ email: 'nobody@test.local', password: 'whatever1' })
        .expect(401);
    }
    await http(app)
      .post(`${API}/auth/login`)
      .send({ email: 'nobody@test.local', password: 'whatever1' })
      .expect(429);
  });
});
