"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
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
      <AdminPage title="Edit product">
        <div className="grid gap-6 xl:grid-cols-3" aria-label="Loading" aria-busy="true">
          <Skeleton className="h-96 w-full rounded-2xl xl:col-span-2" />
          <Skeleton className="h-96 w-full rounded-2xl" />
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
          <Link href={adminRoutes.products} className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft aria-hidden="true" />
            All products
          </Link>
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
