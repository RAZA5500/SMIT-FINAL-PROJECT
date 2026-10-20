import { INestApplication } from '@nestjs/common';
import {
  PAYMENT_GATEWAY,
  type PaymentGateway,
} from '../../src/infrastructure/payment/payment-gateway';
import { API, bearer, http } from './auth';

export interface IPaidOrder {
  paymentId: string;
  gatewayRef: string;
  status: string;
}

/** Student checkout jaisa: initiate → mock-complete(outcome) */
export async function payOrder(
  app: INestApplication,
  token: string,
  orderId: string,
  outcome: 'succeeded' | 'failed' = 'succeeded',
): Promise<IPaidOrder> {
  const init = await http(app)
    .post(`${API}/payments/initiate`)
    .set(bearer(token))
    .send({ orderId })
    .expect(200);
  const { paymentId, gatewayRef } = init.body as {
    paymentId: string;
    gatewayRef: string;
  };
  const done = await http(app)
    .post(`${API}/payments/${paymentId}/mock-complete`)
    .set(bearer(token))
    .send({ outcome })
    .expect(200);
  return {
    paymentId,
    gatewayRef,
    status: (done.body as { status: string }).status,
  };
}

/** Gateway jaisa signed webhook — raw body par HMAC-SHA256 `x-signature` */
export function sendWebhook(
  app: INestApplication,
  event: { id: string; type: string; gatewayRef: string },
  signature?: string,
) {
  const body = JSON.stringify(event);
  const gateway = app.get<PaymentGateway>(PAYMENT_GATEWAY);
  return http(app)
    .post(`${API}/webhooks/payments/mock`)
    .set('Content-Type', 'application/json')
    .set('x-signature', signature ?? gateway.signEvent(body))
    .send(body);
}
