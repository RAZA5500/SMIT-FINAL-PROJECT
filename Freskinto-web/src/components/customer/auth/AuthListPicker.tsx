"use client";

import { ArrowRight, Check, ListChecks } from "lucide-react";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { productVisual } from "@/lib/merchandising";
import { cn, pluralize } from "@/lib/utils";

/** Shop ke asli products (background-free cutouts) — tap karke "aaj ki list" banao */
const PRODUCTS = [
  { name: "Royal Gala Apples", label: "Apples" },
  { name: "Premium Bananas", label: "Bananas" },
  { name: "Fresh Bell Peppers", label: "Peppers" },
  { name: "Fresh Whole Milk 1L", label: "Milk" },
  { name: "Whole Wheat Bread Loaf", label: "Bread" },
  { name: "Mature Cheddar Cheese", label: "Cheddar" },
].map((product) => ({ ...product, visual: productVisual(product.name) }));

/**
 * Login page ka left side: "What's on your list today?" — products par tap karo, woh tick ho kar
 * neeche ki list tray mein aa jate hain. Sirf chhota sa khel hai, basket ya server ko kuch nahi bhejta.
 */
export function AuthListPicker() {
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (name: string) =>
    setPicked((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));

  const pickedProducts = picked.map((name) => PRODUCTS.find((product) => product.name === name)!);

  return (
    <Stack gap="5" className="w-full max-w-xl animate-fade-up">
      <Stack gap="3">
        <Heading as="h2" size="1">
          What&rsquo;s on your{" "}
          <Text as="em" variant="accent">
            list
          </Text>{" "}
          today?
        </Heading>
        <Text tone="muted" className="max-w-md text-base">
          Tap a few favourites to jot them down — then sign in and fill your basket.
        </Text>
      </Stack>

      <Grid gap="3" className="grid-cols-3">
        {PRODUCTS.map(({ name, label, visual }) => {
          const selected = picked.includes(name);
          return (
            <Button
              key={name}
              type="button"
              variant="ghost"
              aria-pressed={selected}
              aria-label={label}
              onClick={() => toggle(name)}
              style={{ "--aura": visual.aura } as CSSProperties}
              className={cn(
                "group/pick glass relative h-auto flex-col gap-1 overflow-hidden rounded-3xl border border-glass-border px-3 pt-2.5 pb-3 shadow-xs transition-[translate,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:bg-transparent hover:shadow-lift active:scale-[0.97]",
                selected && "border-brand/60 shadow-soft ring-2 ring-brand/30",
              )}
            >
              <Box
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-[15%] top-[10%] aspect-square rounded-full opacity-40 blur-2xl transition-opacity duration-500 [background:radial-gradient(closest-side,var(--aura),transparent)] group-hover/pick:opacity-80",
                  selected && "opacity-90",
                )}
              />
              {visual.image && (
                <Box key={String(selected)} className={cn("relative size-16 xl:size-20", selected && "animate-bump")}>
                  <Image
                    src={visual.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain drop-shadow-[0_10px_16px_rgb(0_0_0/0.18)] transition-transform duration-500 ease-spring group-hover/pick:scale-110 group-hover/pick:-rotate-6"
                  />
                </Box>
              )}
              <Text as="span" weight="semibold" className="relative text-fs-13">
                {label}
              </Text>
              <Flex
                as="span"
                align="center"
                justify="center"
                aria-hidden="true"
                className={cn(
                  "absolute top-2.5 right-2.5 size-6 rounded-full border transition-all duration-300 ease-spring",
                  selected
                    ? "scale-100 border-brand bg-brand text-white"
                    : "scale-90 border-border bg-background/70 text-transparent group-hover:scale-100",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </Flex>
            </Button>
          );
        })}
      </Grid>

      {/* List tray — chune hue products chhoti goliyon mein, ginti ke saath */}
      <Flex
        align="center"
        gap="3"
        aria-live="polite"
        className="glass min-h-14 rounded-2xl border border-glass-border px-4 py-2.5 shadow-xs"
      >
        {pickedProducts.length === 0 ? (
          <>
            <Flex as="span" align="center" justify="center" aria-hidden="true" className="size-9 shrink-0 rounded-full bg-muted text-muted-foreground">
              <ListChecks className="size-4" />
            </Flex>
            <Text tone="muted" className="text-fs-14">
              Your list is empty — tap something tasty.
            </Text>
          </>
        ) : (
          <>
            <Flex align="center" className="-space-x-2.5">
              {pickedProducts.map(({ name, visual }) => (
                <Box
                  key={name}
                  className="relative size-10 animate-pop-in rounded-full border-2 border-background bg-muted p-1 shadow-xs"
                >
                  {visual.image && <Image src={visual.image} alt="" fill sizes="40px" className="object-contain p-1" />}
                </Box>
              ))}
            </Flex>
            <Stack gap="0" className="min-w-0 flex-1">
              <Text weight="semibold" className="text-fs-14">
                {pluralize(pickedProducts.length, "favourite")} on your list
              </Text>
              <Text tone="muted" className="truncate text-fs-12">
                {pickedProducts.map((product) => product.label).join(", ")}
              </Text>
            </Stack>
            <Flex align="center" gap="1" className="hidden shrink-0 text-fs-13 font-semibold text-brand xl:flex">
              Sign in to shop
              <ArrowRight aria-hidden="true" className="size-4" />
            </Flex>
          </>
        )}
      </Flex>
    </Stack>
  );
}
