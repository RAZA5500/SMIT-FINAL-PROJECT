"use client";

import { ArrowRight, Moon, Package, Search, ShoppingBasket, Store, Sun, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Box } from "@/components/ui/box";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Flex, Stack } from "@/components/ui/flex";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/typography";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/useTheme";
import { categoryTheme, TILE_CLASSES } from "@/lib/merchandising";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import { useShopStore } from "@/stores/shop-store";
import { useAisles } from "../shop/use-aisles";

const MIN_QUERY = 2;
const SUGGESTION_LIMIT = 6;
export const POPULAR_SEARCHES = ["Apples", "Milk", "Chicken", "Bread", "Cheese", "Spinach"];

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ⌘K / Ctrl+K command palette (shadcn Command): live product suggestions, aisles, quick jumps
 * aur theme switch — sab keyboard se. Enter "search the shop" par `/shop?q=` khulta hai.
 */
export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search the market"
      description="Find products, jump to an aisle or a page"
      className="sm:max-w-2xl"
    >
      {/* Band hone par body unmount — agli dafa khali query se shuru */}
      {open && <SearchPaletteBody onClose={() => onOpenChange(false)} />}
    </CommandDialog>
  );
}

function SearchPaletteBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const { aisles } = useAisles();
  const [value, setValue] = useState("");
  const query = useDebounce(value.trim(), 200);
  const enabled = query.length >= MIN_QUERY;
  const { data, isFetching } = useGetProducts({ q: query, limit: SUGGESTION_LIMIT }, enabled);
  const products = enabled ? (data?.data ?? []) : [];
  const typed = value.trim();
  const matchingAisles = typed
    ? aisles.filter((aisle) => aisle.name.toLowerCase().includes(typed.toLowerCase()))
    : aisles.slice(0, 6);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Command shouldFilter={false} loop className="rounded-none! p-0">
      <CommandInput
        value={value}
        onValueChange={setValue}
        placeholder="Search apples, milk, chicken… or an aisle"
        aria-label="Search products and aisles"
      />
      <CommandList className="max-h-112 px-2 pb-2">
        {typed.length >= MIN_QUERY && (
          <CommandGroup heading="Search">
            <CommandItem value={`search:${typed}`} onSelect={() => go(shopUrl({ q: typed }))}>
              <Search aria-hidden="true" />
              Search the shop for “{typed}”
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        )}

        {enabled && (
          <CommandGroup heading={isFetching && !products.length ? "Searching the shelves…" : "Products"}>
            {isFetching && !products.length && (
              <Flex align="center" gap="2" className="px-3 py-2.5 text-muted-foreground">
                <Spinner aria-hidden="true" />
                <Text as="span" tone="muted">
                  Looking for “{query}”
                </Text>
              </Flex>
            )}
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={`product:${product.id}`}
                onSelect={() => go(publicRoutes.product(product.id))}
                className="gap-3"
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
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!typed && (
          <CommandGroup heading="Popular right now">
            <Flex wrap gap="2" className="px-2 pt-1 pb-2">
              {POPULAR_SEARCHES.map((term) => (
                <CommandItem
                  key={term}
                  value={`popular:${term}`}
                  onSelect={() => setValue(term)}
                  className="w-auto rounded-md! border border-border px-2.5! py-1! data-[selected=true]:border-input"
                >
                  <TrendingUp aria-hidden="true" className="text-muted-foreground" />
                  {term}
                </CommandItem>
              ))}
            </Flex>
          </CommandGroup>
        )}

        {matchingAisles.length > 0 && (
          <CommandGroup heading="Aisles">
            {matchingAisles.map((aisle) => {
              const Icon = categoryTheme(aisle.name).icon;
              return (
                <CommandItem
                  key={aisle.id}
                  value={`aisle:${aisle.id}`}
                  onSelect={() => go(shopUrl({ category: aisle.id }))}
                >
                  <Flex
                    as="span"
                    align="center"
                    justify="center"
                    aria-hidden="true"
                    className={cn("size-7 rounded-md", TILE_CLASSES.chip)}
                  >
                    <Icon />
                  </Flex>
                  {aisle.name}
                  {aisle.children.length > 0 && (
                    <Text as="span" tone="muted" className="truncate text-fs-12">
                      {aisle.children.map((child) => child.name).join(" · ")}
                    </Text>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {!typed && (
          <>
            <CommandSeparator className="my-1" />
            <CommandGroup heading="Jump to">
              <CommandItem value="nav:shop" onSelect={() => go(publicRoutes.shop)}>
                <Store aria-hidden="true" />
                Browse the whole shop
                <ArrowRight aria-hidden="true" className="ml-auto" />
              </CommandItem>
              <CommandItem
                value="nav:basket"
                onSelect={() => {
                  onClose();
                  setCartOpen(true);
                }}
              >
                <ShoppingBasket aria-hidden="true" />
                Open my basket
              </CommandItem>
              <CommandItem value="nav:orders" onSelect={() => go(customerRoutes.orders)}>
                <Package aria-hidden="true" />
                Track my orders
              </CommandItem>
              <CommandItem value="nav:theme" onSelect={toggleTheme}>
                {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {enabled && !isFetching && products.length === 0 && matchingAisles.length === 0 && (
          <CommandEmpty>No products or aisles match “{query}”.</CommandEmpty>
        )}
      </CommandList>
      <Flex
        align="center"
        justify="between"
        gap="3"
        className="border-t border-border bg-muted/50 px-4 py-2.5 text-fs-12 text-muted-foreground"
      >
        <Flex align="center" gap="1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Text as="span" tone="muted" className="text-fs-12">
            to move
          </Text>
          <Kbd className="ml-2">↵</Kbd>
          <Text as="span" tone="muted" className="text-fs-12">
            to open
          </Text>
        </Flex>
        <Box className="hidden sm:block">
          <Kbd>Esc</Kbd>
          <Text as="span" tone="muted" className="ml-1.5 text-fs-12">
            to close
          </Text>
        </Box>
      </Flex>
    </Command>
  );
}
