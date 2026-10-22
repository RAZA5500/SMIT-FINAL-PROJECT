import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
import { cn, formatMoney } from "@/lib/utils";
import { ProductImage } from "../ProductImage";

export interface OrderLine {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  /** Unit price (API money string) */
  price: string;
  subtotal: string;
}

/** Order ke waqt ka name/price snapshot — shadcn `Item` list */
export function OrderLines({ lines, className }: { lines: OrderLine[]; className?: string }) {
  return (
    <ItemGroup className={cn("gap-0 divide-y divide-dashed divide-border", className)}>
      {lines.map((line) => (
        <Item key={line.id} role="listitem" className="gap-3 rounded-none px-0 py-3 first:pt-0 last:pb-0">
          <ItemMedia className="overflow-hidden rounded-xl">
            <ProductImage name={line.name} sizes="56px" className="size-14" imageClassName="p-1.5" />
          </ItemMedia>
          <ItemContent className="min-w-0 gap-0.5">
            <ItemTitle className="font-semibold">{line.name}</ItemTitle>
            <ItemDescription className="text-fs-13">
              <Text as="span" tone="inherit" numeric className="text-fs-13">
                {line.quantity} × {formatMoney(line.price)}
              </Text>
              {line.sku && (
                <>
                  {" · "}
                  <Text as="span" tone="inherit" family="mono" className="text-fs-12">
                    {line.sku}
                  </Text>
                </>
              )}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Text as="span" weight="semibold" numeric>
              {formatMoney(line.subtotal)}
            </Text>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
