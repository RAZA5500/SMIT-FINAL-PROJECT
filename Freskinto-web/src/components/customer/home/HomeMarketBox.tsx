"use client";

import { Check, PackageOpen, Plus, ShoppingBasket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heading, Text } from "@/components/ui/typography";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { ProductImage } from "@/components/shared/ProductImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { loginUrl } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import { useAddCartItem } from "@/services/cart/mutations";
import { useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";
import type { CategoryNode } from "../shop/category-tree";
import { useAisles } from "../shop/use-aisles";

const SLOT_COUNT = 4;
const OPTIONS_PER_SLOT = 3;

type Picks = Record<string, IProduct | null>;

/** Ek aisle ka slot: us ke pehle 3 in-stock products — ek chuno (dobara tap = skip) */
function BoxSlot({
  aisle,
  index,
  picked,
  onPick,
}: {
  aisle: CategoryNode;
  index: number;
  picked: IProduct | null | undefined;
  onPick: (product: IProduct | null) => void;
}) {
  const { data, isLoading } = useGetProducts({ categoryId: aisle.id, limit: OPTIONS_PER_SLOT + 3 });
  const options = (data?.data ?? []).filter((product) => product.stockStatus !== "OUT_OF_STOCK").slice(0, OPTIONS_PER_SLOT);
  const current = picked ?? null;

  return (
    <Card className={cn("gap-3 rounded-3xl border-2 py-4 shadow-none transition-colors", current && "border-primary")}>
      <CardHeader className="px-4">
        <Flex align="center" justify="between" gap="2">
          <Text variant="eyebrow" tone="primary">
            Slot {index + 1}
          </Text>
          {current ? (
            <Badge variant="lime" className="animate-pop">
              <Check aria-hidden="true" />
              Picked
            </Badge>
          ) : (
            <Badge variant="tag">Optional</Badge>
          )}
        </Flex>
        <CardTitle className="truncate text-lg font-bold">{aisle.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <Box className="relative">
          {current ? (
            <ProductImage
              key={current.id}
              name={current.name}
              categoryName={current.category.name}
              sizes="240px"
              className="animate-pop rounded-2xl"
              imageClassName="p-6"
            />
          ) : (
            <Flex
              align="center"
              justify="center"
              className="aspect-square rounded-2xl border-2 border-dashed border-input bg-muted/40 text-muted-foreground"
            >
              <PackageOpen aria-hidden="true" className="size-10" strokeWidth={1.4} />
            </Flex>
          )}
        </Box>

        {isLoading ? (
          <Stack gap="1.5">
            {Array.from({ length: OPTIONS_PER_SLOT }, (_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-xl" />
            ))}
          </Stack>
        ) : options.length === 0 ? (
          <Text tone="muted" className="text-fs-13">
            Nothing in stock here right now.
          </Text>
        ) : (
          <ToggleGroup
            aria-label={`Pick from ${aisle.name}`}
            orientation="vertical"
            spacing={1}
            value={current ? [current.id] : []}
            onValueChange={(next) => onPick(options.find((option) => option.id === next[0]) ?? null)}
            className="w-full"
          >
            {options.map((option) => (
              <ToggleGroupItem
                key={option.id}
                value={option.id}
                className="h-auto w-full justify-between gap-2 rounded-xl px-3 py-2 text-left aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              >
                <Text as="span" tone="inherit" className="truncate text-fs-13">
                  {option.name}
                </Text>{" "}
                <Text as="span" tone="inherit" family="mono" weight="bold" className="shrink-0 text-fs-12">
                  {formatMoney(option.price)}
                </Text>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * "Build a market box" — har aisle se ek asli product chuno aur sab ek click mein basket mein.
 * Koi naqli discount nahi: har item apni asli qeemat par add hota hai, totals basket mein server se.
 */
export function HomeMarketBox() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const addItem = useAddCartItem({ silent: true });
  const { aisles, isLoading } = useAisles();
  const slots = aisles.slice(0, SLOT_COUNT);
  const [picks, setPicks] = useState<Picks>({});
  const [adding, setAdding] = useState(false);

  const chosen = slots.map((aisle) => picks[aisle.id]).filter((product): product is IProduct => Boolean(product));

  const addBox = async () => {
    if (!token || !user) {
      router.push(loginUrl(pathname));
      return;
    }
    if (user.role !== "CUSTOMER") {
      toastError("Shopping is for customers", "Admin accounts can't add items to a basket.");
      return;
    }
    setAdding(true);
    let added = 0;
    for (const product of chosen) {
      try {
        await addItem.mutateAsync({ productId: product.id, quantity: product.minimumOrderQuantity });
        added += 1;
      } catch (error) {
        toastError(`Couldn't add ${product.name}`, error instanceof Error ? error.message : undefined);
      }
    }
    setAdding(false);
    if (added > 0) {
      toastSuccess("Market box packed", `${pluralize(added, "item")} added to your basket.`);
      setPicks({});
      setCartOpen(true);
    }
  };

  if (!isLoading && slots.length === 0) return null;

  return (
    <Stack
      as="section"
      aria-labelledby="box-heading"
      gap="8"
      className="rounded-4xl border-2 border-border bg-plum-soft p-5 sm:p-8 lg:p-10"
    >
      <SectionHeading
        id="box-heading"
        eyebrow="Interactive"
        title="Build your market box"
        description="Pick one thing from each stall — tap again to skip a slot. Everything goes in at its shelf price."
      />

      <Grid gap="4" className="sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: SLOT_COUNT }, (_, i) => <Skeleton key={i} className="h-96 rounded-3xl" />)
          : slots.map((aisle, index) => (
              <BoxSlot
                key={aisle.id}
                aisle={aisle}
                index={index}
                picked={picks[aisle.id]}
                onPick={(product) => setPicks((current) => ({ ...current, [aisle.id]: product }))}
              />
            ))}
      </Grid>

      <Flex
        direction="col"
        justify="between"
        gap="4"
        className="rounded-3xl bg-night p-5 text-night-foreground sm:flex-row sm:items-center sm:p-6"
      >
        <Flex align="center" gap="4" className="min-w-0">
          <Flex align="center" justify="center" className="size-12 shrink-0 -rotate-6 rounded-2xl bg-lime text-lime-foreground">
            <ShoppingBasket aria-hidden="true" className="size-6" />
          </Flex>
          <Stack gap="1" className="min-w-0">
            <Heading as="p" size="4" tone="night">
              {chosen.length === 0 ? "Your box is empty" : `${pluralize(chosen.length, "pick")} in your box`}
            </Heading>
            <Text tone="night-muted" className="truncate text-fs-13">
              {chosen.length === 0 ? "Choose from the stalls above to start packing." : chosen.map((item) => item.name).join(" · ")}
            </Text>
          </Stack>
        </Flex>
        <Flex gap="2" className="shrink-0">
          {chosen.length > 0 && (
            <Button variant="glass" size="lg" onClick={() => setPicks({})} disabled={adding}>
              Clear
            </Button>
          )}
          <LoadingButton
            variant="cta"
            size="lg"
            disabled={chosen.length === 0}
            isLoading={adding}
            loadingText="Packing your box…"
            onClick={() => void addBox()}
          >
            <Plus aria-hidden="true" />
            Add box to basket
          </LoadingButton>
        </Flex>
      </Flex>
    </Stack>
  );
}
