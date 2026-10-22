"use client";

import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Grid } from "@/components/ui/grid";
import { Stack } from "@/components/ui/flex";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCard } from "./product/ProductCard";
import { ProductListItem } from "./product/ProductListItem";
import { PRODUCT_GRID_CLASS } from "./product/product-grid";
import { ProductGridSkeleton } from "./product/ProductCardSkeleton";

interface ProductListingProps {
  products: IProduct[] | undefined;
  layout?: "grid" | "list";
  isLoading?: boolean;
  /** Background refetch — grid halka dhundla, blank nahi (keepPreviousData) */
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  /** Initial loading skeleton — kabhi "Loading…" text nahi */
  skeleton?: ReactNode;
  /** Zero results par custom empty state */
  emptyState?: ReactNode;
  /** Pehle kitne cards ki image eager load */
  eagerCount?: number;
  className?: string;
}

/**
 * Responsive product grid/list with every state built in: skeleton, error (retry), empty,
 * aur subtle background-refetch dimming. Cards ek ek kar ke fade-up hote hain.
 */
export function ProductListing({
  products,
  layout = "grid",
  isLoading = false,
  isFetching = false,
  isError = false,
  errorMessage,
  onRetry,
  skeleton,
  emptyState,
  eagerCount = 4,
  className,
}: ProductListingProps) {
  if (isLoading) return <>{skeleton ?? <ProductGridSkeleton className={className} />}</>;

  if (isError) {
    return <ErrorState title="Couldn't load products" message={errorMessage} onRetry={onRetry} className={className} />;
  }

  if (!products?.length) {
    return (
      <>
        {emptyState ?? (
          <EmptyState
            icon={<SearchX aria-hidden="true" />}
            title="No products yet"
            message="New products will appear here soon."
            className={className}
          />
        )}
      </>
    );
  }

  const dimmed = isFetching && "opacity-60 transition-opacity";

  if (layout === "list") {
    return (
      <Stack as="ul" gap="3" className={cn(dimmed, className)}>
        {products.map((product) => (
          <Box as="li" key={product.id}>
            <ProductListItem product={product} />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Grid as="ul" className={cn(PRODUCT_GRID_CLASS, dimmed, className)}>
      {products.map((product, index) => (
        <Box
          as="li"
          key={product.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
        >
          <ProductCard product={product} eager={index < eagerCount} />
        </Box>
      ))}
    </Grid>
  );
}
