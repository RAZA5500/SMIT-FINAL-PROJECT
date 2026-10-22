import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import {
  Receipt,
  ReceiptBarcode,
  ReceiptFooter,
  ReceiptHeader,
  ReceiptLines,
  ReceiptMeta,
  ReceiptRow,
  ReceiptSeparator,
  ReceiptTitle,
} from "@/components/ui/receipt";
import { Text } from "@/components/ui/typography";
import { LogoMark } from "@/components/shared/Logo";
import { STORE } from "@/constants/store";
import { formatMoney, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ICart } from "@/services/cart/types";

interface CartReceiptProps {
  cart: ICart;
  title?: string;
  /** Checkout/payment par items ki read-only list bhi */
  showItems?: boolean;
  /** Action buttons (checkout, pay) — receipt ke andar */
  children?: ReactNode;
  className?: string;
}

/**
 * Basket totals as a till receipt. Totals hamesha backend ke — UI hisaab nahi
 * lagati. Delivery backend par 0 hai (shipping = 0), is liye "Free" likhna sach
 * hai; final total order banne par server tay karta hai.
 */
export function CartReceipt({ cart, title = "Order summary", showItems = false, children, className }: CartReceiptProps) {
  return (
    <Receipt aria-label={title} className={cn(className)}>
      <ReceiptHeader>
        <LogoMark size="sm" />
        <ReceiptTitle>{title}</ReceiptTitle>
        <ReceiptMeta>
          {STORE.name} · {pluralize(cart.itemCount, "item")}
        </ReceiptMeta>
      </ReceiptHeader>

      <ReceiptSeparator />

      {showItems && (
        <>
          <Box className={cn("scrollbar-thin max-h-64 overflow-y-auto")}>
            <Stack as="ul" gap="2.5" className={cn("pr-1")}>
              {cart.items.map((item) => (
                <Flex as="li" key={item.id} align="baseline" justify="between" gap="3">
                  <Text as="span" className={cn("min-w-0")}>
                    <Text as="span" variant="code" tone="muted">
                      {item.quantity}×
                    </Text>{" "}
                    {item.name}
                  </Text>
                  <Text as="span" weight="medium" numeric className={cn("shrink-0")}>
                    {formatMoney(item.lineTotal)}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Box>
          <ReceiptSeparator />
        </>
      )}

      <ReceiptLines>
        <ReceiptRow label={`Subtotal (${pluralize(cart.itemCount, "item")})`} value={formatMoney(cart.subtotal)} />
        <ReceiptRow label="Delivery" value={<Badge variant="outline" className={cn("text-brand")}>Free</Badge>} />
        <ReceiptRow
          emphasis
          label="Total"
          value={formatMoney(cart.grandTotal)}
          className={cn("border-t border-dashed border-input pt-3")}
        />
      </ReceiptLines>

      {children && <Stack gap="2.5">{children}</Stack>}

      <ReceiptFooter>
        <ReceiptBarcode />
        <Text as="span" variant="code" tone="muted" className={cn("uppercase")}>
          No delivery charges · No hidden fees
        </Text>
      </ReceiptFooter>
    </Receipt>
  );
}
