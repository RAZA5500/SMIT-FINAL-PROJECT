import { Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className={cn("font-sans text-base")}>Shop preview</CardTitle>
        <CardDescription>How customers will see it on the shelf.</CardDescription>
        <CardAction>
          <Badge variant="outline" className={cn("text-brand")}>
            <Sparkles aria-hidden="true" />
            Live
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3")}>
        <Card aria-hidden="true" className={cn("mx-auto w-full max-w-60 gap-0 py-0 overflow-hidden")}>
          <ProductImage name={displayName} categoryName={categoryName} sizes="240px" />
          <div className="flex flex-col gap-3 p-3.5">
            <div className="flex flex-col gap-1">
              <span className="text-fs-11 font-bold tracking-wider text-muted-foreground uppercase truncate">
                {categoryName || "Category"}
              </span>
              <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground">
                {displayName}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <Price amount={Number.isFinite(priceValue) && priceValue > 0 ? priceValue : 0} size="md" tone="brand" />
              <span className="text-fs-12 text-muted-foreground">
                {minQty > 1 ? `Min. ${minQty}` : "each"}
              </span>
            </div>
            <Button size="sm" tabIndex={-1} className={cn("pointer-events-none w-full rounded-full")}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Add to basket
            </Button>
          </div>
        </Card>
        <p className="text-fs-12 text-muted-foreground">
          {hasPhoto
            ? "A matching demo photo is used for this name."
            : "No demo photo matches this name — the shop shows the category icon instead."}
        </p>
      </CardContent>
    </Card>
  );
}
