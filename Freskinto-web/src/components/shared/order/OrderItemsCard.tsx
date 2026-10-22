import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ReceiptLines, ReceiptRow } from "@/components/ui/receipt";
import { Text } from "@/components/ui/typography";
import { formatMoney, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";
import { ProductImage } from "../ProductImage";

/** Order ke items (order ke waqt ka name/price snapshot) + server ke totals */
export function OrderItemsCard({ order }: { order: IOrder }) {
  const freeShipping = Number(order.shippingCost) === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
        <CardAction>
          <Badge variant="brand">{pluralize(order.items.length, "line")}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className={cn("gap-1")}>
          {order.items.map((item) => (
            <Item key={item.id} size="sm" className={cn("px-0")}>
              <ItemMedia className={cn("size-14 overflow-hidden rounded-xl")}>
                <ProductImage name={item.productName} sizes="56px" className={cn("size-14")} imageClassName={cn("p-1.5")} />
              </ItemMedia>
              <ItemContent className={cn("min-w-0")}>
                <ItemTitle className={cn("line-clamp-1 font-semibold")}>{item.productName}</ItemTitle>
                <ItemDescription>
                  <Text as="span" numeric>
                    {item.quantity} × {formatMoney(item.price)}
                  </Text>{" "}
                  ·{" "}
                  <Text as="span" variant="code">
                    {item.sku}
                  </Text>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Text as="span" weight="semibold" numeric>
                  {formatMoney(item.subtotal)}
                </Text>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
      <CardFooter className={cn("justify-end")}>
        <ReceiptLines className={cn("w-full max-w-xs")}>
          <ReceiptRow label="Subtotal" value={formatMoney(order.subtotal)} />
          <ReceiptRow
            label={order.deliveryType === "PICKUP" ? "Collection" : "Delivery"}
            value={
              freeShipping ? (
                <Text as="span" weight="semibold" className={cn("text-brand-green")}>
                  Free
                </Text>
              ) : (
                formatMoney(order.shippingCost)
              )
            }
          />
          <ReceiptRow emphasis label="Total" value={formatMoney(order.total)} className={cn("border-t border-dashed border-input pt-3")} />
        </ReceiptLines>
      </CardFooter>
    </Card>
  );
}
