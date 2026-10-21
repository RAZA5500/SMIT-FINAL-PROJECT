"use client";

import { shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import { ProductRail } from "../product/ProductRail";

const LIMIT = 12;

/** Home "Just landed" — catalog ke naye products (backend sort: newest) */
export function NewArrivals() {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ page: 1, limit: LIMIT, sortBy: "newest" });

  return (
    <div className="container-page">
      <ProductRail
        title="Just landed"
        description="The newest additions to our shelves."
        href={shopUrl({ sort: "newest" })}
        products={data?.data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
      />
    </div>
  );
}
