"use client";

import Link from "next/link";
import { ErrorState } from "@/components/shared/ErrorState";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/networking/request";
import { adminRoutes } from "@/lib/routes/routes";
import { useGetAdminProduct } from "@/services/products/queries";
import { ProductForm } from "./ProductForm";

export function EditProductView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error, refetch } = useGetAdminProduct(id);

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 bg-navbar-bg p-4 sm:p-5" aria-label="Loading" aria-busy="true">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </main>
    );
  }

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <main className="flex flex-1 flex-col items-center bg-navbar-bg p-4 sm:p-5">
        <ErrorState
          title={notFound ? "Product not found" : "Couldn't load this product"}
          message={notFound ? "It may have been removed." : error?.message}
          onRetry={notFound ? undefined : () => void refetch()}
        />
        <Link href={adminRoutes.products} className={buttonVariants({ variant: "outline" })}>
          Back to products
        </Link>
      </main>
    );
  }

  // key — doosra product khule to form naye default values ke saath
  return <ProductForm key={product.id} product={product} />;
}
