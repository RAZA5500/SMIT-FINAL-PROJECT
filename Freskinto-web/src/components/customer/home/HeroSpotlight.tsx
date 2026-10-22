"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Flex, Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { publicRoutes } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import { ProductCartControl } from "../product/ProductCartControl";

const SPOTLIGHT_COUNT = 6;
const AUTOPLAY_MS = 4500;

/**
 * Hero ka right side: naye products ka tilted spotlight carousel (asli catalogue). Khud aage
 * badhta hai, hover/focus par ruk jata hai; reduced motion par autoplay band.
 */
export function HeroSpotlight() {
  const { data, isLoading } = useGetProducts({ limit: SPOTLIGHT_COUNT, sortBy: "newest" });
  const products = data?.data ?? [];
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [api, paused]);

  if (isLoading) {
    return <Skeleton className="mx-auto aspect-4/5 w-full max-w-sm rotate-2 rounded-3xl bg-night-foreground/10" />;
  }
  if (products.length === 0) return null;

  return (
    <Box
      className="relative mx-auto w-full max-w-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Peeche ki tilted cards — stack ka ehsaas */}
      <Box aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-3 rotate-6 rounded-3xl bg-tangerine" />
      <Box aria-hidden="true" className="absolute inset-0 -translate-x-3 translate-y-2 -rotate-3 rounded-3xl bg-lime" />

      <Carousel setApi={setApi} opts={{ loop: true }} aria-label="New on the shelves" className="relative">
        <Card className="gap-0 rounded-3xl border-2 border-pop py-0 shadow-pop">
          <Flex align="center" justify="between" className="px-4 pt-4">
            <Badge variant="sticker">Just landed</Badge>
            <Flex gap="1.5">
              <CarouselPrevious className="static size-8 translate-y-0" />
              <CarouselNext className="static size-8 translate-y-0" />
            </Flex>
          </Flex>
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={product.id}>
                <Stack gap="3" className="p-4">
                  <ProductImage
                    name={product.name}
                    categoryName={product.category.name}
                    alt={product.name}
                    eager={index === 0}
                    sizes="360px"
                    className="rounded-2xl"
                    imageClassName="p-8 animate-float-slow"
                  />
                  <Stack gap="1">
                    <Text variant="eyebrow" tone="muted">
                      {product.category.name}
                    </Text>
                    <Flex align="start" justify="between" gap="3">
                      <Heading as="p" size="4" className="line-clamp-2">
                        {product.name}
                      </Heading>
                      <Price amount={product.price} size="lg" tone="brand" className="shrink-0" />
                    </Flex>
                  </Stack>
                  <Flex gap="2">
                    <Box className="flex-1">
                      <ProductCartControl product={product} />
                    </Box>
                    <ButtonLink
                      href={publicRoutes.product(product.id)}
                      variant="outline"
                      size="icon"
                      aria-label={`View ${product.name}`}
                      className="rounded-full border-2"
                    >
                      <ArrowUpRight aria-hidden="true" />
                    </ButtonLink>
                  </Flex>
                </Stack>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="pb-4 text-primary" />
        </Card>
      </Carousel>
    </Box>
  );
}
