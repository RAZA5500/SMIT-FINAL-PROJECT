import { Plus, Sparkles } from "lucide-react";
import { ProductImage } from "@/components/shared/ProductImage";
import { formatMoney } from "@/lib/format";
import { productPackshot } from "@/lib/merchandising";

interface ProductPreviewProps {
  name: string;
  categoryName?: string;
  price: string;
  minimumOrderQuantity: string;
}

/**
 * Shop card ka live preview — admin ko dikhta hai ke naam se kaunsi demo photo
 * lagegi (ya icon tile), aur price kaisa nazar aayega.
 */
export function ProductPreview({ name, categoryName, price, minimumOrderQuantity }: ProductPreviewProps) {
  const displayName = name.trim() || "Product name";
  const hasPhoto = Boolean(name.trim() && productPackshot(name));
  const priceValue = Number(price);
  const minQty = Number(minimumOrderQuantity);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-semibold">Shop preview</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-lime-soft px-2 py-0.5 text-xs font-semibold text-brand">
          <Sparkles className="size-3" aria-hidden="true" />
          Live
        </span>
      </div>
      <div className="mx-auto w-full max-w-60 rounded-2xl bg-card p-2 ring-1 ring-border" aria-hidden="true">
        <ProductImage name={displayName} categoryName={categoryName} sizes="240px" className="rounded-xl" />
        <div className="flex flex-col px-1.5 pt-3 pb-1">
          <p className="truncate text-xs font-medium text-muted-foreground">{categoryName || "Category"}</p>
          <p className="mt-0.5 line-clamp-2 min-h-10 text-sm leading-5 font-semibold">{displayName}</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="numeric font-heading text-lg leading-none font-bold">
              {Number.isFinite(priceValue) && priceValue > 0 ? formatMoney(priceValue) : "£0.00"}
            </p>
            {minQty > 1 && <p className="text-xs text-muted-foreground">Min. {minQty}</p>}
          </div>
          <span className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            <Plus className="size-4" />
            Add to basket
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {hasPhoto
          ? "A matching demo photo is used for this name."
          : "No demo photo matches this name — the shop shows the category icon instead."}
      </p>
    </div>
  );
}
