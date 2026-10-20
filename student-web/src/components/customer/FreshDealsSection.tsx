"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { publicRoutes } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./ProductCardSkeleton";

const GRID_CLASS = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4";
const POPULAR_LIMIT = 12;

/** Home "Popular Products" — catalog ke pehle products (backend default sort: newest) */
export default function FreshDealsSection() {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ page: 1, limit: POPULAR_LIMIT });

  let content: ReactNode;
  if (isLoading) {
    content = <ProductGridSkeleton count={4} className={GRID_CLASS} />;
  } else if (isError) {
    content = (
      <ErrorState title="Couldn't load products" message={error.message} onRetry={() => void refetch()} />
    );
  } else if (!data?.data.length) {
    content = <EmptyState title="No products yet" message="New products will appear here soon." />;
  } else {
    content = (
      <div className={GRID_CLASS}>
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="product-container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-heading">Popular Products</h2>
          <Link
            className="inline-flex items-center gap-3 text-brand-green transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
            href={publicRoutes.shop}
          >
            <span className="text-sm leading-none md:text-base">View All</span>
            <ArrowRight className="size-2 md:size-4" aria-hidden="true" />
          </Link>
        </div>

        {content}
      </div>
    </section>
  );
}
