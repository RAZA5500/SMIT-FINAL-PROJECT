import { MoneyService } from './money.service';

describe('MoneyService', () => {
  const money = new MoneyService();

  it('10% of 19.99 = 2.00 (half-up to the penny)', () => {
    expect(money.toDecimalString(money.percentage('19.99', 10))).toBe('2.00');
  });

  it('never returns a negative order total', () => {
    expect(
      money.toDecimalString(money.calculateOrderTotal('5.00', '-10.00')),
    ).toBe('0.00');
  });

  it('adds in integer pence — no float rounding (0.1 + 0.2)', () => {
    expect(money.toDecimalString(money.sumItems(['0.10', '0.20']))).toBe(
      '0.30',
    );
  });

  it('multiplies price by quantity exactly', () => {
    expect(money.toDecimalString(money.lineItemTotal('1.99', 3))).toBe('5.97');
  });

  it('adds shipping to subtotal', () => {
    expect(money.toDecimalString(money.calculateOrderTotal('24.90', 0))).toBe(
      '24.90',
    );
  });

  it('formats API money as a 2-decimal string', () => {
    expect(money.toDecimalString(10)).toBe('10.00');
    expect(money.toPence('12.5')).toBe(1250);
  });
});
