"use client";

import { ArrowRight, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Flex, Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/typography";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { useDebounce } from "@/hooks/useDebounce";
import { useTypewriter } from "@/hooks/useTypewriter";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { POPULAR_SEARCHES } from "../layout/SearchPalette";

const MIN_QUERY = 2;
/** Placeholder khud likhta hai — asli shop ke products */
const TYPED = ["Royal Gala apples", "warm bread", "chicken fillets", "fresh milk", "mature cheddar"] as const;

/**
 * Hero ka bara search: typing par live product suggestions (Base UI Autocomplete — combobox
 * keyboard + ARIA); Enter/"Find" shop ko `q` ke saath kholta hai. Trending chips query bhar dete hain.
 */
export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const typed = useTypewriter(TYPED, !focused && value === "");
  const query = useDebounce(value.trim(), 250);
  const enabled = query.length >= MIN_QUERY;
  const { data, isFetching, isError } = useGetProducts({ q: query, limit: 5 }, enabled);
  const results = enabled ? (data?.data ?? []) : [];
  const total = enabled ? (data?.meta.total ?? 0) : 0;

  const submit = () => {
    setOpen(false);
    router.push(value.trim() ? shopUrl({ q: value.trim() }) : publicRoutes.shop);
  };

  let status: string | null = null;
  if (value.trim().length >= MIN_QUERY) {
    if (isFetching && !results.length) status = "Searching the shelves…";
    else if (isError) status = "Couldn't search right now — press Enter to see the shop.";
    else if (enabled && !results.length) status = `No products match “${query}”`;
  }
  const hasContent = value.trim().length >= MIN_QUERY && (results.length > 0 || status !== null);

  return (
    <Stack gap="3" className="w-full max-w-xl">
      <Form
        role="search"
        className="gap-0"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Autocomplete
          items={results}
          value={value}
          open={open && hasContent}
          onOpenChange={setOpen}
          onValueChange={(next, details) => {
            if (details.reason !== "item-press") setValue(next);
          }}
          itemToStringValue={(product: IProduct) => product.name}
          filter={null}
        >
          <AutocompleteInputGroup className="glass dark:bg-glass/80 h-15 border-glass-border pr-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/25">
            <InputGroupAddon className="pl-5 text-muted-foreground">
              {isFetching && enabled ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" className="size-5" />}
            </InputGroupAddon>
            <AutocompleteInput
              aria-label="Search grocery items"
              placeholder={`Search ${typed}`}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="text-base font-medium"
            />
            <InputGroupAddon align="inline-end" className="pr-0">
              <InputGroupButton type="submit" variant="fresh" className="h-11 rounded-full px-5">
                <Text as="span" tone="inherit" weight="bold" className="hidden sm:inline">
                  Search
                </Text>
                <ArrowRight aria-hidden="true" className="sm:hidden" />
              </InputGroupButton>
            </InputGroupAddon>
          </AutocompleteInputGroup>

          <AutocompleteContent>
            <AutocompleteStatus>{status}</AutocompleteStatus>
            <AutocompleteList>
              {(product: IProduct) => (
                <AutocompleteItem
                  key={product.id}
                  value={product}
                  onClick={() => {
                    setOpen(false);
                    router.push(publicRoutes.product(product.id));
                  }}
                >
                  <ProductImage
                    name={product.name}
                    categoryName={product.category.name}
                    sizes="44px"
                    className="size-11 shrink-0 rounded-xl"
                    imageClassName="p-1"
                  />
                  <Stack as="span" gap="0.5" className="min-w-0 flex-1">
                    <Text as="span" weight="medium" className="truncate">
                      {product.name}
                    </Text>
                    <Text as="span" tone="muted" className="truncate text-fs-12">
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
                <Button type="button" variant="ghost" onClick={submit} className="w-full justify-between text-primary">
                  See all {total} results for “{query}”
                  <ArrowRight aria-hidden="true" />
                </Button>
              </AutocompleteFooter>
            )}
          </AutocompleteContent>
        </Autocomplete>
      </Form>

      <Flex wrap align="center" gap="2">
        <Flex as="span" align="center" gap="1.5" className="text-muted-foreground">
          <TrendingUp aria-hidden="true" className="size-3.5" />
          <Text as="span" tone="inherit" className="text-fs-12">
            Popular:
          </Text>
        </Flex>
        {POPULAR_SEARCHES.map((term) => (
          <Button
            key={term}
            type="button"
            variant="outline"
            size="xs"
            onClick={() => {
              setValue(term);
              setOpen(true);
            }}
            className="glass border-glass-border font-semibold text-muted-foreground hover:text-foreground"
          >
            {term}
          </Button>
        ))}
      </Flex>
    </Stack>
  );
}
