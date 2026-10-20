import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryType, OrderStatus } from '@prisma/client';
import { OrderQueryService } from './order-query.service';
import { OrderStatusService } from './order-status.service';
import { OrdersDbService } from './orders.db.service';
import { ADMIN_ALLOWED_TRANSITIONS } from './types/order.types';

const ALL_STATUSES = Object.values(OrderStatus);

/** Transition ke liye sahi delivery type (READY_FOR_PICKUP → PICKUP waghera) */
function deliveryTypeFor(next: OrderStatus): DeliveryType {
  return next === OrderStatus.READY_FOR_PICKUP
    ? DeliveryType.PICKUP
    : DeliveryType.DELIVERY;
}

describe('OrderStatusService', () => {
  let service: OrderStatusService;
  let db: jest.Mocked<
    Pick<OrdersDbService, 'findStatusInfo' | 'updateStatusGuarded'>
  >;

  beforeEach(() => {
    db = {
      findStatusInfo: jest.fn(),
      updateStatusGuarded: jest.fn().mockResolvedValue(1),
    };
    service = new OrderStatusService(
      db as unknown as OrdersDbService,
      {
        getForAdmin: jest.fn().mockResolvedValue({ id: 'o1' }),
      } as unknown as OrderQueryService,
    );
  });

  const allowed = ALL_STATUSES.flatMap((from) =>
    ADMIN_ALLOWED_TRANSITIONS[from].map((to) => [from, to] as const),
  );
  const forbidden = ALL_STATUSES.flatMap((from) =>
    ALL_STATUSES.filter(
      (to) =>
        to !== OrderStatus.CANCELLED &&
        !ADMIN_ALLOWED_TRANSITIONS[from].includes(to),
    ).map((to) => [from, to] as const),
  );

  it('the allowed map matches FLOW-MD 01 §19 exactly', () => {
    expect(allowed).toEqual([
      [OrderStatus.CONFIRMED, OrderStatus.PROCESSING],
      [OrderStatus.PROCESSING, OrderStatus.READY_FOR_PICKUP],
      [OrderStatus.PROCESSING, OrderStatus.READY_FOR_DELIVERY],
      [OrderStatus.READY_FOR_PICKUP, OrderStatus.DELIVERED],
      [OrderStatus.READY_FOR_DELIVERY, OrderStatus.DELIVERED],
    ]);
  });

  it.each(allowed)(
    '%s → %s is allowed (guarded on the current status)',
    async (from, to) => {
      db.findStatusInfo.mockResolvedValue({
        id: 'o1',
        status: from,
        deliveryType: deliveryTypeFor(to),
      });
      await service.updateStatus('o1', to);
      expect(db.updateStatusGuarded).toHaveBeenCalledWith(
        { id: 'o1', status: from },
        expect.objectContaining({ status: to }),
      );
    },
  );

  it.each(forbidden)('%s → %s is rejected with 400', async (from, to) => {
    db.findStatusInfo.mockResolvedValue({
      id: 'o1',
      status: from,
      deliveryType: deliveryTypeFor(to),
    });
    await expect(service.updateStatus('o1', to)).rejects.toThrow(
      BadRequestException,
    );
    expect(db.updateStatusGuarded).not.toHaveBeenCalled();
  });

  it('sets the matching timestamp', async () => {
    db.findStatusInfo.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.CONFIRMED,
      deliveryType: DeliveryType.DELIVERY,
    });
    await service.updateStatus('o1', OrderStatus.PROCESSING);
    expect(db.updateStatusGuarded.mock.calls[0][1]).toHaveProperty(
      'processedAt',
    );
  });

  it('delivery-type mismatch → 400', async () => {
    db.findStatusInfo.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.PROCESSING,
      deliveryType: DeliveryType.DELIVERY,
    });
    await expect(
      service.updateStatus('o1', OrderStatus.READY_FOR_PICKUP),
    ).rejects.toThrow(BadRequestException);

    db.findStatusInfo.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.PROCESSING,
      deliveryType: DeliveryType.PICKUP,
    });
    await expect(
      service.updateStatus('o1', OrderStatus.READY_FOR_DELIVERY),
    ).rejects.toThrow(BadRequestException);
  });

  it('CANCELLED is only possible through the cancel endpoint', async () => {
    await expect(
      service.updateStatus('o1', OrderStatus.CANCELLED),
    ).rejects.toThrow(
      new BadRequestException('Use the cancel endpoint to cancel an order'),
    );
  });

  it('another admin changed it first → 409', async () => {
    db.findStatusInfo.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.CONFIRMED,
      deliveryType: DeliveryType.DELIVERY,
    });
    db.updateStatusGuarded.mockResolvedValue(0);
    await expect(
      service.updateStatus('o1', OrderStatus.PROCESSING),
    ).rejects.toThrow(ConflictException);
  });

  it('unknown order → 404', async () => {
    db.findStatusInfo.mockResolvedValue(null);
    await expect(
      service.updateStatus('o1', OrderStatus.PROCESSING),
    ).rejects.toThrow(NotFoundException);
  });
});
