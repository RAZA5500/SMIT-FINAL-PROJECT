import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryType, TransactionType } from '@prisma/client';
import {
  ORDER_PAYMENT_TIMEOUT_MINUTES,
  ORDER_SHIPPING_COST,
} from '../../common/constants';
import { MoneyService } from '../../shared/money/money.service';
import { AddressesDbService } from '../addresses/addresses.db.service';
import { ADDRESS_NOT_FOUND } from '../addresses/addresses.service';
import type { IAuthUser } from '../auth/types/auth.types';
import { CartDbService } from '../cart/cart.db.service';
import { InventoryDbService } from '../inventory/inventory.db.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryService } from './order-query.service';
import { OrdersDbService } from './orders.db.service';
import { IOrder, IOrderAddress, IOrderLine } from './types/order.types';

export const CART_EMPTY_MESSAGE = 'Cart is empty. Cannot create order.';

/**
 * Checkout (FLOW-MD 01 §14): cart → firm order, stock deduct, server price,
 * sab EK transaction mein. Duplicate submit ko cart-clear rokta hai (dobara → Cart is empty).
 */
@Injectable()
export class OrderCreationService {
  constructor(
    private readonly ordersDb: OrdersDbService,
    private readonly cartDb: CartDbService,
    private readonly inventoryDb: InventoryDbService,
    private readonly addressesDb: AddressesDbService,
    private readonly orderQuery: OrderQueryService,
    private readonly money: MoneyService,
  ) {}

  async createOrder(user: IAuthUser, dto: CreateOrderDto): Promise<IOrder> {
    const address = await this.resolveDeliveryDetails(user, dto);
    const orderNumber = this.formatOrderNumber(
      await this.ordersDb.nextOrderNumber(),
    );

    const orderId = await this.ordersDb.transaction(async (tx) => {
      // Cart row lock: same customer ke parallel orders ek-ek kar ke chalte hain
      const cart = await this.cartDb.lockCart(tx, user.id);
      const items = cart
        ? await this.cartDb.findItemsForOrder(tx, cart.id)
        : [];
      if (!cart || items.length === 0) {
        throw new BadRequestException(CART_EMPTY_MESSAGE);
      }
      if (items.some((item) => !item.product.isActive)) {
        throw new BadRequestException('Product is no longer available.');
      }

      // Items productId order mein (deterministic lock order → deadlock nahi)
      const locked = await this.inventoryDb.lockByProductIds(
        tx,
        items.map((item) => item.productId),
      );
      const inventoryByProduct = new Map(
        locked.map((row) => [row.productId, row]),
      );

      for (const item of items) {
        const available =
          inventoryByProduct.get(item.productId)?.qtyOnHand ?? 0;
        if (available < item.quantity) {
          throw new BadRequestException(
            `Not enough stock. Requested: ${item.quantity}, Available: ${available}.`,
          );
        }
      }

      // Stock order create par hi deduct (reservation nahi)
      for (const item of items) {
        const row = inventoryByProduct.get(item.productId)!;
        await this.inventoryDb.setQuantity(
          tx,
          row,
          row.qtyOnHand - item.quantity,
        );
      }

      // Price hamesha server se — product ki current price, client ki nahi
      const lines: IOrderLine[] = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: this.money.lineItemTotal(item.product.price, item.quantity),
      }));
      const subtotal = this.money.sumItems(lines.map((line) => line.subtotal));
      const shippingCost = this.money.fromPence(
        this.money.toPence(ORDER_SHIPPING_COST),
      );

      const order = await this.ordersDb.createOrder(tx, {
        orderNumber,
        userId: user.id,
        deliveryType: dto.deliveryType,
        subtotal,
        shippingCost,
        total: this.money.calculateOrderTotal(subtotal, shippingCost),
        customerNotes: dto.customerNotes || null,
        pickupScheduledAt: dto.pickupScheduledAt
          ? new Date(dto.pickupScheduledAt)
          : null,
        paymentExpiresAt: new Date(
          Date.now() + ORDER_PAYMENT_TIMEOUT_MINUTES * 60_000,
        ),
        items: lines,
        address,
      });

      await this.inventoryDb.createTransactions(
        tx,
        order.items.map((orderItem) => ({
          inventoryId: inventoryByProduct.get(orderItem.productId)!.id,
          type: TransactionType.CONSUMED,
          quantity: orderItem.quantity,
          orderItemId: orderItem.id,
        })),
      );
      await this.cartDb.clearItems(tx, cart.id);
      return order.id;
    });

    return this.orderQuery.getForCustomer(user, orderId);
  }

  /**
   * DELIVERY: exactly ek — apna saved addressId ya inline shippingAddress; pickup time mana.
   * PICKUP: pickupScheduledAt zaroori; address mana.
   */
  private async resolveDeliveryDetails(
    user: IAuthUser,
    dto: CreateOrderDto,
  ): Promise<IOrderAddress | null> {
    if (dto.deliveryType === DeliveryType.DELIVERY) {
      if (dto.pickupScheduledAt) {
        throw new BadRequestException(
          'Pickup time is only allowed for pickup orders',
        );
      }
      if (dto.addressId && dto.shippingAddress) {
        throw new BadRequestException(
          'Provide either addressId or shippingAddress, not both',
        );
      }
      if (dto.shippingAddress) {
        const { addressLine, city, county, postcode } = dto.shippingAddress;
        return { addressLine, city, county, postcode };
      }
      if (!dto.addressId) {
        throw new BadRequestException('Delivery orders require an address');
      }
      const saved = await this.addressesDb.findOwned(dto.addressId, user.id);
      if (!saved) {
        throw new NotFoundException(ADDRESS_NOT_FOUND);
      }
      return {
        addressLine: saved.addressLine,
        city: saved.city,
        county: saved.county,
        postcode: saved.postcode,
      };
    }

    if (dto.addressId || dto.shippingAddress) {
      throw new BadRequestException(
        'Pickup orders cannot have a delivery address',
      );
    }
    if (!dto.pickupScheduledAt) {
      throw new BadRequestException('Pickup orders require pickupScheduledAt');
    }
    if (new Date(dto.pickupScheduledAt).getTime() <= Date.now()) {
      throw new BadRequestException('Pickup time must be in the future');
    }
    return null;
  }

  /** `ORD-<YEAR>-<000001>` */
  private formatOrderNumber(sequenceValue: number): string {
    return `ORD-${new Date().getUTCFullYear()}-${String(sequenceValue).padStart(6, '0')}`;
  }
}
