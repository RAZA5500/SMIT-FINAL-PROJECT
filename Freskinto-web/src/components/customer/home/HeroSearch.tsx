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
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { POPULAR_SEARCHES } from "../layout/SearchPalette";

const MIN_QUERY = 2;

/**
 * Hero ka bara search: typing par live product suggestions (Base UI Autocomplete — combobox
 * keyboard + ARIA); Enter/"Find" shop ko `q` ke saath kholta hai. Trending chips query bhar dete hain.
 */
export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
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
          <AutocompleteInputGroup className="h-14 rounded-full border-2 border-pop bg-card pr-1.5 shadow-pop has-[[data-slot=input-group-control]:focus-visible]:ring-4 has-[[data-slot=input-group-control]:focus-visible]:ring-lime/60 dark:border-transparent">
            <InputGroupAddon className="pl-5 text-primary">
              {isFetching && enabled ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" className="size-5" />}
            </InputGroupAddon>
            <AutocompleteInput
              aria-label="Search grocery items"
              placeholder="Search apples, sourdough, chicken fillets, milk…"
              className="text-base"
            />
            <InputGroupAddon align="inline-end" className="pr-0">
              <InputGroupButton
                type="submit"
                variant="default"
                className="h-11 rounded-full bg-tangerine px-5 font-bold text-tangerine-foreground hover:bg-tangerine/90"
              >
                <Text as="span" tone="inherit" weight="bold" className="hidden sm:inline">
                  Find fresh
                </Text>
                <ArrowRight aria-hidden="true" />
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
                    className="size-11 shrink-0 rounded-lg"
                    imageClassName="p-1"
                  />
                  <Stack as="span" gap="0.5" className="min-w-0 flex-1">
                    <Text as="span" weight="semibold" className="truncate">
                      {product.name}
                    </Text>
                    <Text as="span" tone="muted" className="truncate text-fs-12">
                      {product.category.name}
                    </Text>
                  </Stack>
                  <Price amount={product.price} size="sm" tone="brand" />
                </AutocompleteItem>
              )}
            </AutocompleteList>
            {results.length > 0 && (
              <AutocompleteFooter>
                {/* Portal form ke bahar render hota hai — submit nahi, seedha handler */}
                <Button type="button" variant="ghost" onClick={submit} className="w-full justify-between rounded-xl text-primary">
                  See all {total} results for “{query}”
                  <ArrowRight aria-hidden="true" />
                </Button>
              </AutocompleteFooter>
            )}
          </AutocompleteContent>
        </Autocomplete>
      </Form>

      <Flex wrap align="center" gap="2">
        <Flex as="span" align="center" gap="1.5" className="text-night-muted">
          <TrendingUp aria-hidden="true" className="size-4 text-lime" />
          <Text as="span" tone="inherit" weight="semibold" className="text-fs-12">
            Trending:
          </Text>
        </Flex>
        {POPULAR_SEARCHES.map((term) => (
          <Button
            key={term}
            type="button"
            variant="glass"
            size="xs"
            onClick={() => {
              setValue(term);
              setOpen(true);
            }}
            className="hover:bg-lime hover:text-lime-foreground"
          >
            {term}
          </Button>
        ))}
      </Flex>
    </Stack>
  );
}
