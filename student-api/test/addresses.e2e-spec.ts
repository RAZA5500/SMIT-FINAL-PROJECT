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

const address = (line: string, isDefault?: boolean) => ({
  addressLine: line,
  city: 'London',
  county: 'Greater London',
  postcode: 'E1 1AA',
  ...(isDefault !== undefined && { isDefault }),
});

describe('Address book (e2e)', () => {
  let app: INestApplication;
  let alice: ITestUser;
  let bob: ITestUser;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    alice = await registerCustomer(app, { email: 'alice@test.local' });
    bob = await registerCustomer(app, { email: 'bob@test.local' });
  });

  afterAll(async () => {
    await app.close();
  });

  const create = (user: ITestUser, body: object) =>
    http(app).post(`${API}/addresses`).set(bearer(user.token)).send(body);

  it("another customer's address → 404 for GET-list scope, PATCH, DELETE and default", async () => {
    const res = await create(alice, address('1 Alice Road')).expect(201);
    const id = (res.body as { id: string }).id;

    await http(app)
      .patch(`${API}/addresses/${id}`)
      .set(bearer(bob.token))
      .send({ city: 'Leeds' })
      .expect(404);
    await http(app)
      .delete(`${API}/addresses/${id}`)
      .set(bearer(bob.token))
      .expect(404);
    await http(app)
      .patch(`${API}/addresses/${id}/default`)
      .set(bearer(bob.token))
      .expect(404);

    const bobList = await http(app)
      .get(`${API}/addresses`)
      .set(bearer(bob.token))
      .expect(200);
    expect(bobList.body.data).toEqual([]);
  });

  it('only one default per user — the last default wins, default listed first', async () => {
    await create(alice, address('First', true)).expect(201);
    const second = await create(alice, address('Second', true)).expect(201);
    await create(alice, address('Third')).expect(201);

    const list = await http(app)
      .get(`${API}/addresses`)
      .set(bearer(alice.token))
      .expect(200);
    const defaults = list.body.data.filter(
      (a: { isDefault: boolean }) => a.isDefault,
    );
    expect(defaults).toHaveLength(1);
    expect(list.body.data[0].id).toBe(second.body.id);
  });

  it('PATCH /:id/default switches the default in one transaction', async () => {
    const first = await create(alice, address('First', true)).expect(201);
    const second = await create(alice, address('Second')).expect(201);
    await http(app)
      .patch(`${API}/addresses/${second.body.id}/default`)
      .set(bearer(alice.token))
      .expect(200);

    const list = await http(app)
      .get(`${API}/addresses`)
      .set(bearer(alice.token))
      .expect(200);
    const byId = Object.fromEntries(
      list.body.data.map((a: { id: string; isDefault: boolean }) => [
        a.id,
        a.isDefault,
      ]),
    );
    expect(byId).toEqual({ [first.body.id]: false, [second.body.id]: true });
  });

  it('deleting the default makes the newest remaining address the default', async () => {
    await create(alice, address('Old')).expect(201);
    const newest = await create(alice, address('Newest')).expect(201);
    const def = await create(alice, address('Default', true)).expect(201);

    await http(app)
      .delete(`${API}/addresses/${def.body.id}`)
      .set(bearer(alice.token))
      .expect(204);
    const list = await http(app)
      .get(`${API}/addresses`)
      .set(bearer(alice.token))
      .expect(200);
    expect(list.body.data[0]).toMatchObject({
      id: newest.body.id,
      isDefault: true,
    });
  });

  it('isDefault cannot be changed through PATCH /:id (whitelist) and fields are validated', async () => {
    const res = await create(alice, address('Line')).expect(201);
    await http(app)
      .patch(`${API}/addresses/${res.body.id}`)
      .set(bearer(alice.token))
      .send({ isDefault: true })
      .expect(400);
    await create(alice, { ...address('x'), postcode: 'P'.repeat(21) }).expect(
      400,
    );
  });

  it('admin cannot use the customer address book (403)', async () => {
    const admin = await createAdmin(app);
    await http(app)
      .get(`${API}/addresses`)
      .set(bearer(admin.token))
      .expect(403);
  });
});
