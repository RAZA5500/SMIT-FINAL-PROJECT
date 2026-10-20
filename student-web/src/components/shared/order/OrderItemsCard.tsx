import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney } from "@/lib/format";
import type { IOrder } from "@/services/orders/types";

/** Order ke items (order ke waqt ka name/price snapshot) + server ke totals */
export function OrderItemsCard({ order }: { order: IOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">
          Items ({order.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="block font-medium text-gray-900">{item.productName}</span>
                  <span className="text-xs text-gray-500">{item.sku}</span>
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatMoney(item.price)}</TableCell>
                <TableCell className="text-right font-medium">{formatMoney(item.subtotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-summary-label">Subtotal</dt>
            <dd className="font-medium text-price-text">{formatMoney(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-summary-label">Shipping</dt>
            <dd className="font-medium text-price-text">{formatMoney(order.shippingCost)}</dd>
          </div>
          <div className="flex justify-between border-t border-summary-divider pt-2">
            <dt className="font-semibold text-summary-label">Total</dt>
            <dd className="text-base font-bold text-brand-green">{formatMoney(order.total)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
