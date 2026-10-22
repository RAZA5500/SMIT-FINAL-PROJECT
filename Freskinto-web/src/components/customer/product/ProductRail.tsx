"use client";

import { useId, type ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Flex, Stack } from "@/components/ui/flex";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

const ITEM_CLASS = "basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 lg:basis-1/4 xl:basis-1/5";

export interface ProductRailProps {
  title: string;
  description?: string;
  /** "View all" link */
  href?: string;
  eyebrow?: ReactNode;
  products: IProduct[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  errorTitle?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
}

/** Horizontal product shelf (shadcn Carousel / Embla) — swipe on touch, arrows on desktop */
export function ProductRail({
  title,
  description,
  href,
  eyebrow,
  products,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  errorTitle = "Couldn't load products",
  emptyTitle = "No products yet",
  emptyMessage = "New products will appear here soon.",
  className,
}: ProductRailProps) {
  const headingId = useId();

  let body: ReactNode;
  if (isLoading) {
    body = (
      <Flex gap="4" aria-label="Loading products" aria-busy="true" className={cn("overflow-hidden")}>
        {Array.from({ length: 5 }, (_, i) => (
          <ProductCardSkeleton key={i} className={cn("w-1/2 shrink-0 sm:w-1/3 lg:w-1/4 xl:w-1/5")} />
        ))}
      </Flex>
    );
  } else if (isError) {
    body = <ErrorState title={errorTitle} message={errorMessage} onRetry={onRetry} className={cn("py-8")} />;
  } else if (!products?.length) {
    body = <EmptyState title={emptyTitle} message={emptyMessage} className={cn("py-8")} />;
  } else {
    body = (
      <CarouselContent className={cn("-ml-3 py-1 sm:-ml-4")}>
        {products.map((product) => (
          <CarouselItem key={product.id} className={cn(ITEM_CLASS)}>
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    );
  }

  const hasSlides = !isLoading && !isError && Boolean(products?.length);

  return (
    <Stack gap="5" className={cn(className)}>
      <Carousel opts={{ align: "start", dragFree: true }} aria-labelledby={headingId} className={cn("flex flex-col gap-5")}>
        <SectionHeading
          id={headingId}
          title={title}
          eyebrow={eyebrow}
          description={description}
          href={href}
          actions={
            hasSlides && (
              <Flex gap="2" className={cn("hidden md:flex")}>
                <CarouselPrevious className={cn("static size-9 translate-none")} />
                <CarouselNext className={cn("static size-9 translate-none")} />
              </Flex>
            )
          }
        />
        {body}
      </Carousel>
    </Stack>
  );
}
