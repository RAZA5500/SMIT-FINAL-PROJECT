"use client";

import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteFooter,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { useDebounce } from "@/hooks/useDebounce";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";

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
 * Header search: typing shows live product suggestions (Base UI Autocomplete — combobox keyboard
 * + ARIA); Enter/"Search" opens the shop filtered by `q`.
 */
function HeaderSearchForm({ initialQuery, className }: { initialQuery: string; className?: string }) {
  const router = useRouter();
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
    if (isFetching && !results.length) status = "Searching the shelves…";
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
      <Autocomplete
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
        <AutocompleteInputGroup className="h-11 rounded-full border-transparent bg-muted/70 pr-1 shadow-none hover:border-input has-[[data-slot=input-group-control]:focus-visible]:bg-card">
          <InputGroupAddon className="pl-4">
            {isFetching && enabled ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Search aria-hidden="true" />
            )}
          </InputGroupAddon>
          <AutocompleteInput aria-label="Search products" placeholder="Search apples, milk, chicken…" />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton type="submit" size="sm" variant="default" className="h-9 rounded-full px-4">
              <span className="hidden font-semibold sm:inline">Search</span>
              <ArrowRight aria-hidden="true" className="sm:hidden" />
              <span className="sr-only sm:hidden">Search</span>
            </InputGroupButton>
          </InputGroupAddon>
        </AutocompleteInputGroup>

        <AutocompleteContent>
          <AutocompleteStatus>{status}</AutocompleteStatus>
          <AutocompleteList>
            {(product: IProduct) => (
              <AutocompleteItem key={product.id} value={product} onClick={() => openProduct(product)}>
                <ProductImage
                  name={product.name}
                  categoryName={product.category.name}
                  sizes="44px"
                  className="size-11 shrink-0 rounded-lg"
                  imageClassName="p-1"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium">{product.name}</span>
                  <span className="truncate text-fs-12 text-muted-foreground">{product.category.name}</span>
                </span>
                <Price amount={product.price} size="sm" tone="brand" />
              </AutocompleteItem>
            )}
          </AutocompleteList>
          {results.length > 0 && (
            <AutocompleteFooter>
              {/* Portal form ke bahar render hota hai — submit nahi, seedha handler */}
              <Button
                type="button"
                variant="ghost"
                onClick={submit}
                className="w-full justify-between rounded-xl text-brand-green hover:text-brand-green-dark"
              >
                See all {total} results for “{query}”
                <ArrowRight aria-hidden="true" />
              </Button>
            </AutocompleteFooter>
          )}
        </AutocompleteContent>
      </Autocomplete>
    </form>
  );
}
