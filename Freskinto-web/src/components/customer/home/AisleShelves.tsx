"use client";

import { useMemo } from "react";
import { Container } from "@/components/ui/container";
import { AisleTag } from "@/components/shared/AisleTag";
import { pluralize } from "@/lib/format";
import { shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import { ProductRail } from "../product/ProductRail";
import { totalProducts, type CategoryNode } from "../shop/category-tree";
import { useAisles } from "../shop/use-aisles";

const FEATURED_AISLES = 2;
const RAIL_LIMIT = 10;

/** Sab se bari do aisles ki shelves (backend productCount se andaza; khali shelf chhupti hai) */
export function AisleShelves() {
  const { aisles } = useAisles();
  const featured = useMemo(
    () =>
      aisles
        .map((aisle, index) => ({ aisle, index }))
        .filter(({ aisle }) => totalProducts(aisle) > 0)
        .sort((a, b) => totalProducts(b.aisle) - totalProducts(a.aisle))
        .slice(0, FEATURED_AISLES),
    [aisles],
  );

  return featured.map(({ aisle, index }) => <AisleShelf key={aisle.id} aisle={aisle} index={index} />);
}

function AisleShelf({ aisle, index }: { aisle: CategoryNode; index: number }) {
  // Top-level categoryId par backend children ke products bhi deta hai
  const { data, isLoading, isError, error, refetch } = useGetProducts({ categoryId: aisle.id, limit: RAIL_LIMIT });

  // Sirf hidden products wali aisle — khali shelf mat dikhao
  if (data && data.meta.total === 0) return null;
  const total = data?.meta.total;

  return (
    <Container>
      <ProductRail
        title={aisle.name}
        eyebrow={<AisleTag index={index} label="Shop the aisle" />}
        description={total === undefined ? undefined : `${pluralize(total, "product")} on this aisle`}
        href={shopUrl({ category: aisle.id })}
        products={data?.data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
      />
    </Container>
  );
}
