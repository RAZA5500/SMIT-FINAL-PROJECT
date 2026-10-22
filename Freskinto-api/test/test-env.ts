/** e2e tests hamesha alag test database par chalte hain (FLOW-MD 12 §2) */
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://onlinemart:onlinemart@localhost:5433/onlinemart_test?schema=public';
