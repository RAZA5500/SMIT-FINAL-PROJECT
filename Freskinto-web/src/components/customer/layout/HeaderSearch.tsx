"use client";

import { ArrowRight, Search } from "lucide-react";
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
import { Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/typography";
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
  return <HeaderSearchForm key={urlQuery} initialQuery={urlQuery} className={cn(className)} />;
}

/** Suspense fallback / static shell — same size, no suggestions */
export function HeaderSearchFallback({ className }: { className?: string }) {
  return <HeaderSearchForm initialQuery="" className={cn(className)} />;
}

/**
 * Header search: typing shows live product suggestions (Base UI Autocomplete —
 * combobox keyboard + ARIA); Enter/"Search" opens the shop filtered by `q`.
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
    <Form
      role="search"
      className={cn("w-full gap-0", className)}
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
        <AutocompleteInputGroup className={cn("h-11 rounded-full bg-muted pr-1 hover:border-input has-[[data-slot=input-group-control]:focus-visible]:bg-background")}>
          <InputGroupAddon className={cn("pl-4")}>
            {isFetching && enabled ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" />}
          </InputGroupAddon>
          <AutocompleteInput aria-label="Search products" placeholder="Search apples, milk, chicken…" />
          <InputGroupAddon align="inline-end" className={cn("gap-2 pr-0")}>
            <Kbd className={cn("hidden bg-background lg:inline-flex")}>Enter</Kbd>
            <InputGroupButton
              type="submit"
              size="sm"
              variant="default"
              className={cn("h-9 rounded-full px-4")}
            >
              <Text as="span" className={cn("hidden font-semibold sm:inline")}>
                Search
              </Text>
              <ArrowRight aria-hidden="true" className={cn("sm:hidden")} />
              <Text as="span" className={cn("sr-only sm:hidden")}>
                Search
              </Text>
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
                  className={cn("size-11 shrink-0 rounded-lg")}
                  imageClassName={cn("p-1")}
                />
                <Stack gap="0.5" className={cn("min-w-0 flex-1")}>
                  <Text as="span" weight="medium" className={cn("truncate")}>
                    {product.name}
                  </Text>
                  <Text as="span" variant="small" tone="muted" className={cn("truncate")}>
                    {product.category.name}
                  </Text>
                </Stack>
                <Price amount={product.price} size="sm" />
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
                className={cn("w-full justify-between rounded-xl text-brand hover:text-brand-strong")}
              >
                See all {total} results for “{query}”
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            </AutocompleteFooter>
          )}
        </AutocompleteContent>
      </Autocomplete>
    </Form>
  );
}
