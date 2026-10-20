import { TEST_DATABASE_URL } from './test-env';

// process.env ki values .env file par jeet-ti hain — is liye app test DB use karti hai
process.env.NODE_ENV = 'test';
process.env.URL_PREFIX = 'v1';
process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_SECRET = 'e2e-test-jwt-secret-that-is-at-least-32-chars';
process.env.JWT_EXPIRES_IN = '1d';
process.env.CORS_ORIGINS = 'http://localhost:3000';
process.env.PAYMENT_WEBHOOK_SECRET = 'e2e-test-payment-webhook-secret';
