"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/useDebounce";
import { formatMoney } from "@/lib/format";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { ProductImage } from "@/components/shared/ProductImage";

const MIN_QUERY = 2;
const SUGGESTION_LIMIT = 6;

/** Shop par URL ka `q` search box mein — key se form naya bane jab query badle */
export function HeaderSearch({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const urlQuery = pathname === publicRoutes.shop ? (params.get("q") ?? "") : "";
  return <HeaderSearchForm key={urlQuery} initialQuery={urlQuery} className={className} />;
}

/** Suspense fallback / static shell — same size, no suggestions */
export function HeaderSearchFallback({ className }: { className?: string }) {
  return <HeaderSearchForm initialQuery="" className={className} />;
}

/**
 * Header search: typing shows live product suggestions (Base UI Autocomplete —
 * combobox keyboard + ARIA); Enter/"Search" opens the shop filtered by `q`.
 */
function HeaderSearchForm({ initialQuery, className }: { initialQuery: string; className?: string }) {
  const router = useRouter();
  const anchor = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(initialQuery);
  const [popupOpen, setPopupOpen] = useState(false);
  const query = useDebounce(value.trim(), 250);
  const enabled = query.length >= MIN_QUERY;
  const { data, isFetching, isError } = useGetProducts({ q: query, limit: SUGGESTION_LIMIT }, enabled);
  const results = enabled ? (data?.data ?? []) : [];
  const total = enabled ? (data?.meta.total ?? 0) : 0;

  const submit = () => {
    setPopupOpen(false);
    router.push(shopUrl({ q: value.trim() || undefined }));
  };

  const openProduct = (product: IProduct) => {
    setPopupOpen(false);
    router.push(publicRoutes.product(product.id));
  };

  let status: string | null = null;
  if (value.trim().length >= MIN_QUERY) {
    if (isFetching && !results.length) status = "Searching…";
    else if (isError) status = "Couldn't search right now — press Enter to see the shop.";
    else if (enabled && !results.length) status = `No products match “${query}”`;
  }
  const hasContent = value.trim().length >= MIN_QUERY && (results.length > 0 || status !== null);

  return (
    <form
      role="search"
      className={cn("w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Autocomplete.Root
        items={results}
        value={value}
        open={popupOpen && hasContent}
        onOpenChange={setPopupOpen}
        onValueChange={(next, details) => {
          if (details.reason !== "item-press") setValue(next);
        }}
        itemToStringValue={(product: IProduct) => product.name}
        filter={null}
      >
        <InputGroup
          ref={anchor}
          className="h-11 rounded-full border-transparent bg-muted pr-1 shadow-none hover:border-transparent has-[[data-slot=input-group-control]:focus-visible]:bg-card"
        >
          <InputGroupAddon className="pl-4">
            {isFetching && enabled ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Search aria-hidden="true" />
            )}
          </InputGroupAddon>
          <Autocomplete.Input
            data-slot="input-group-control"
            aria-label="Search products"
            placeholder="Search apples, milk, chicken…"
            className="h-full min-w-0 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm"
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <Button type="submit" size="sm" className="h-9 px-4">
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="sm:hidden" aria-hidden="true" />
              <span className="sr-only sm:hidden">Search</span>
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <Autocomplete.Portal>
          <Autocomplete.Positioner anchor={anchor} sideOffset={8} align="start" className="isolate z-50">
            <Autocomplete.Popup className="w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-lift ring-1 ring-border">
              <Autocomplete.Status>
                {status && <p className="px-4 py-3 text-sm text-muted-foreground">{status}</p>}
              </Autocomplete.Status>
              <Autocomplete.List className="max-h-(--available-height) overflow-y-auto p-1.5 data-empty:p-0">
                {(product: IProduct) => (
                  <Autocomplete.Item
                    key={product.id}
                    value={product}
                    onClick={() => openProduct(product)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 outline-none select-none data-highlighted:bg-accent"
                  >
                    <ProductImage
                      name={product.name}
                      categoryName={product.category.name}
                      sizes="44px"
                      className="size-11 shrink-0 rounded-lg"
                      imageClassName="p-1"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{product.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{product.category.name}</span>
                    </span>
                    <span className="numeric text-sm font-semibold">{formatMoney(product.price)}</span>
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
              {results.length > 0 && (
                // Portal form ke bahar render hota hai — submit nahi, seedha handler
                <button
                  type="button"
                  onClick={submit}
                  className="flex w-full items-center justify-between gap-2 border-t bg-muted/50 px-4 py-3 text-sm font-semibold text-brand hover:bg-muted"
                >
                  See all {total} results for “{query}”
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </form>
  );
}
