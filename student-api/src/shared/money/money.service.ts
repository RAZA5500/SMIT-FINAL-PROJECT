import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type MoneyInput = Prisma.Decimal | string | number;

/**
 * Paise ka saara hisaab integer pence mein — float kabhi nahi (FLOW-MD 03 §6).
 * DB `Decimal(10,2)`, API string `"12.50"`.
 */
@Injectable()
export class MoneyService {
  /** Decimal → integer pence (half-up rounding) */
  toPence(value: MoneyInput): number {
    return new Prisma.Decimal(value)
      .mul(100)
      .toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP)
      .toNumber();
  }

  fromPence(pence: number): Prisma.Decimal {
    return new Prisma.Decimal(pence).div(100);
  }

  /** price × quantity */
  lineItemTotal(price: MoneyInput, quantity: number): Prisma.Decimal {
    return this.fromPence(this.toPence(price) * quantity);
  }

  sumItems(amounts: MoneyInput[]): Prisma.Decimal {
    return this.fromPence(
      amounts.reduce<number>((sum, amount) => sum + this.toPence(amount), 0),
    );
  }

  /** subtotal + shipping — total kabhi 0 se kam nahi */
  calculateOrderTotal(
    subtotal: MoneyInput,
    shippingCost: MoneyInput,
  ): Prisma.Decimal {
    const total = this.toPence(subtotal) + this.toPence(shippingCost);
    return this.fromPence(Math.max(0, total));
  }

  /** amount ka percent, pence tak half-up rounded (e.g. 10% of 19.99 = 2.00) */
  percentage(amount: MoneyInput, percent: number): Prisma.Decimal {
    return new Prisma.Decimal(amount)
      .mul(percent)
      .div(100)
      .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  }

  /** API ke liye: hamesha 2 decimals wali string */
  toDecimalString(value: MoneyInput): string {
    return new Prisma.Decimal(value).toFixed(2);
  }
}
