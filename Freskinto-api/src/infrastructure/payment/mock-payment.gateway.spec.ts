import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/env.validation';
import { MockPaymentGateway } from './mock-payment.gateway';

describe('MockPaymentGateway', () => {
  const config = {
    get: () => 'unit-test-webhook-secret',
  } as unknown as ConfigService<EnvironmentVariables, true>;
  const gateway = new MockPaymentGateway(config);

  it('verifies its own HMAC-SHA256 signature', () => {
    const payload = JSON.stringify({ id: 'evt_1', type: 'payment.succeeded' });
    expect(gateway.verifyEvent(payload, gateway.signEvent(payload))).toBe(true);
  });

  it('rejects a tampered payload, a wrong signature and a missing one', () => {
    const payload = '{"id":"evt_1"}';
    const signature = gateway.signEvent(payload);
    expect(gateway.verifyEvent('{"id":"evt_2"}', signature)).toBe(false);
    expect(gateway.verifyEvent(payload, 'deadbeef')).toBe(false);
    expect(gateway.verifyEvent(payload, 'not-hex!')).toBe(false);
    expect(gateway.verifyEvent(payload, undefined)).toBe(false);
  });

  it('returns the same intent for the same idempotency key', async () => {
    const a = await gateway.createIntent({
      amount: '10.00',
      idempotencyKey: 'o1:1',
    });
    const b = await gateway.createIntent({
      amount: '10.00',
      idempotencyKey: 'o1:1',
    });
    const c = await gateway.createIntent({
      amount: '10.00',
      idempotencyKey: 'o1:2',
    });
    expect(a.gatewayRef).toBe(b.gatewayRef);
    expect(a.gatewayRef).not.toBe(c.gatewayRef);
    expect(a.gatewayRef).toMatch(/^mock_pi_[0-9a-f]{24}$/);
  });
});
