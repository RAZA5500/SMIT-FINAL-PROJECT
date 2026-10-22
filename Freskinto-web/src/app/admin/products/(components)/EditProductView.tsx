"use client";

import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPage } from "@/components/admin/AdminPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ErrorState } from "@/components/shared/ErrorState";
import { ApiError } from "@/lib/api";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetAdminProduct } from "@/services/products/queries";
import { ProductForm } from "./ProductForm";

export function EditProductView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error, refetch } = useGetAdminProduct(id);

  if (isLoading) {
    return (
      <AdminPage title="Edit product">
        <div aria-label="Loading" aria-busy="true" className={cn("grid gap-6 xl:grid-cols-3")}>
          <Skeleton className={cn("h-96 w-full rounded-2xl xl:col-span-2")} />
          <Skeleton className={cn("h-96 w-full rounded-2xl")} />
        </div>
      </AdminPage>
    );
  }

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <AdminPage
        title="Edit product"
        actions={
          <ButtonLink href={adminRoutes.products} variant="outline">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            All products
          </ButtonLink>
        }
      >
        <ErrorState
          title={notFound ? "Product not found" : "Couldn't load this product"}
          message={notFound ? "It may have been removed." : error?.message}
          onRetry={notFound ? undefined : () => void refetch()}
        />
      </AdminPage>
    );
  }

  // key — doosra product khule to form naye default values ke saath
  return <ProductForm key={product.id} product={product} />;
}
