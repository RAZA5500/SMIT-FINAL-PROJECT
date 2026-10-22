import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types';
import { DatabaseService } from '../../src/database/database.service';

export const API = '/v1';

export interface ITestUser {
  id: string;
  email: string;
  password: string;
  token: string;
}

export function http(app: INestApplication) {
  return request(app.getHttpServer() as App);
}

export async function login(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const res = await http(app)
    .post(`${API}/auth/login`)
    .send({ email, password })
    .expect(200);
  return (res.body as { accessToken: string }).accessToken;
}

/** Admin sirf seed se banta hai — test mein seed jaisa direct DB insert */
export async function createAdmin(app: INestApplication): Promise<ITestUser> {
  const email = 'admin@test.local';
  const password = 'AdminPass123';
  const admin = await app.get(DatabaseService).user.create({
    data: {
      email,
      name: 'Test Admin',
      role: UserRole.ADMIN,
      passwordHash: await hash(password, 4),
    },
  });
  return {
    id: admin.id,
    email,
    password,
    token: await login(app, email, password),
  };
}

let customerCounter = 0;

/** Asal register endpoint se customer + login token */
export async function registerCustomer(
  app: INestApplication,
  overrides: { email?: string; name?: string } = {},
): Promise<ITestUser> {
  customerCounter += 1;
  const email = overrides.email ?? `customer${customerCounter}@test.local`;
  const password = 'CustomerPass123';
  const res = await http(app)
    .post(`${API}/auth/register`)
    .send({
      name: overrides.name ?? `Customer ${customerCounter}`,
      email,
      password,
    })
    .expect(201);
  const id = (res.body as { id: string }).id;
  return { id, email, password, token: await login(app, email, password) };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
