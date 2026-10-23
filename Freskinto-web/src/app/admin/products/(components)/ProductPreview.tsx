import { Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { productPackshot } from "@/lib/merchandising";
import { cn } from "@/lib/utils";

interface ProductPreviewProps {
  name: string;
  categoryName?: string;
  price: string;
  minimumOrderQuantity: string;
}

/**
 * Shop card ka live preview — admin ko dikhta hai ke naam se kaunsi demo photo
 * lagegi (ya icon tile), aur price shelf label par kaisa nazar aayega.
 */
export function ProductPreview({ name, categoryName, price, minimumOrderQuantity }: ProductPreviewProps) {
  const displayName = name.trim() || "Product name";
  const hasPhoto = Boolean(name.trim() && productPackshot(name));
  const priceValue = Number(price);
  const minQty = Number(minimumOrderQuantity);

  return (
    <Card className="rounded-[1.5rem]">
      <CardHeader>
        <CardTitle className={cn("font-sans text-base")}>Shop preview</CardTitle>
        <CardDescription>How customers will see it on the shelf.</CardDescription>
        <CardAction>
          <Badge variant="brand">
            <Sparkles aria-hidden="true" />
            Live
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3")}>
        <Card aria-hidden="true" className="mx-auto w-full max-w-60 gap-0 rounded-[1.9rem] p-2 shadow-none">
          <ProductImage name={displayName} categoryName={categoryName} sizes="240px" className="rounded-[1.4rem]" />
          <Stack gap="3" className="px-2.5 pt-3.5 pb-2">
            <Stack gap="1">
              <Text as="span" variant="eyebrow" tone="muted" className="truncate">
                {categoryName || "Category"}
              </Text>
              <Text weight="semibold" className="line-clamp-2 min-h-10 leading-5">
                {displayName}
              </Text>
            </Stack>
            <Flex align="baseline" justify="between" gap="2">
              <Price amount={Number.isFinite(priceValue) && priceValue > 0 ? priceValue : 0} size="md" />
              <Text as="span" tone="muted" className="text-fs-12">
                {minQty > 1 ? `Min. ${minQty}` : "each"}
              </Text>
            </Flex>
            <Button
              variant="outline"
              size="sm"
              tabIndex={-1}
              className={cn("pointer-events-none w-full border border-foreground/80 font-semibold")}
            >
              <Plus data-icon="inline-start" aria-hidden="true" />
              Add to basket
            </Button>
          </Stack>
        </Card>
        <Text tone="muted" className="text-fs-12">
          {hasPhoto
            ? "A matching demo photo is used for this name."
            : "No demo photo matches this name — the shop shows the category icon instead."}
        </Text>
      </CardContent>
    </Card>
  );
}
