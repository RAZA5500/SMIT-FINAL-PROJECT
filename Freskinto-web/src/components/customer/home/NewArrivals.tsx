"use client";

import { shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import { Container } from "@/components/ui/container";
import { ProductRail } from "../product/ProductRail";

const LIMIT = 12;

/** Home "Just landed" — catalog ke naye products (backend sort: newest) */
export function NewArrivals() {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ page: 1, limit: LIMIT, sortBy: "newest" });

  return (
    <Container>
      <ProductRail
        eyebrow="Fresh on the shelves"
        title="Just landed"
        description="The newest additions to the market."
        href={shopUrl({ sort: "newest" })}
        products={data?.data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
      />
    </Container>
  );
}
