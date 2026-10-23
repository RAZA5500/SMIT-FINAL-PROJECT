import { PackageCheck, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { LogoMark } from "@/components/shared/Logo";
import { OrderTotals } from "@/components/shared/order/OrderTotals";
import { STORE } from "@/constants/store";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import type { ICart } from "@/services/cart/types";

interface CartSummaryCardProps {
  cart: ICart;
  title?: string;
  /** Checkout/payment par items ki read-only list bhi */
  showItems?: boolean;
  /** Sirf jab API discount de (abhi nahi) — row tab hi dikhti hai */
  discount?: string | null;
  /** Action buttons (checkout, pay) — card ke andar */
  children?: ReactNode;
  className?: string;
}

/**
 * Basket totals card — raat jaisa "receipt" (dark scope), upar halki hari roshni, phatne wali
 * dashed lakeer; gradient checkout button is par sab se zyada chamakta hai. Totals hamesha backend ke — UI hisaab nahi lagati. Delivery backend par
 * 0 hai (shipping = 0), is liye "Free"; final total order banne par server tay karta hai.
 */
export function CartSummaryCard({
  cart,
  title = "Order summary",
  showItems = false,
  discount,
  children,
  className,
}: CartSummaryCardProps) {
  return (
    <Card
      render={<Box as="section" aria-label={title} />}
      size="lg"
      className={cn("dark relative isolate rounded-[2rem] border-white/[0.07] bg-[#0b1611] shadow-lift", className)}
    >
      <Box aria-hidden="true" className="absolute -top-24 -right-20 -z-10 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.3),transparent)]" />
      <Box aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen" />
      <CardHeader className="border-b border-dashed border-white/15 [.border-b]:pb-5">
        <Flex align="center" gap="3">
          <LogoMark size="sm" />
          <Stack>
            <CardTitle render={<Box as="span" />} className="text-xl font-semibold">
              {title}
            </CardTitle>
            <CardDescription className="text-fs-12">
              {STORE.name} · {pluralize(cart.itemCount, "item")}
            </CardDescription>
          </Stack>
        </Flex>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {showItems && (
          <Stack
            as="ul"
            gap="2.5"
            className="scrollbar-thin max-h-64 overflow-y-auto border-b border-dashed border-white/15 pr-1 pb-4 text-sm"
          >
              {cart.items.map((item) => (
                <Flex as="li" key={item.id} align="baseline" justify="between" gap="3">
                  <Text as="span" className="min-w-0">
                    <Text as="span" tone="muted" family="mono" className="text-fs-12">
                      {item.quantity}×
                    </Text>{" "}
                    {item.name}
                  </Text>
                  <Text as="span" weight="medium" numeric className="shrink-0">
                    {formatMoney(item.lineTotal)}
                  </Text>
                </Flex>
              ))}
          </Stack>
        )}

        <OrderTotals
          subtotalLabel={`Subtotal (${pluralize(cart.itemCount, "item")})`}
          subtotal={cart.subtotal}
          shippingCost="0"
          discount={discount}
          total={cart.grandTotal}
        />

        {children && <Stack gap="2.5">{children}</Stack>}

        <Stack as="ul" gap="2" className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-3.5 text-fs-13 text-muted-foreground">
          <Flex as="li" align="center" gap="2.5">
            <Truck aria-hidden="true" className="size-4 shrink-0 text-brand" />
            Free delivery on every order — no minimum spend
          </Flex>
          <Flex as="li" align="center" gap="2.5">
            <PackageCheck aria-hidden="true" className="size-4 shrink-0 text-brand" />
            Cancel any time before we start packing
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  );
}
