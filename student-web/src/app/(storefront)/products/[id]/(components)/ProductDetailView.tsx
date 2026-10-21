"use client";

import { ArrowLeft, Clock, Flame, PackageCheck, Store, Truck } from "lucide-react";
import Link from "next/link";
import { PageBreadcrumbs } from "@/components/customer/CustomerPage";
import { ProductImage } from "@/components/shared/ProductImage";
import { ProductRail } from "@/components/customer/product/ProductRail";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { ApiError } from "@/lib/networking/request";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProduct, useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { PurchasePanel } from "./PurchasePanel";

const RELATED_LIMIT = 12;

/** Store ke asli wade — FLOW-MD 01 (shipping 0, pickup slot, cancel before packing) */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order — no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Choose a collection time at checkout." },
  { icon: Clock, title: "Pay in minutes", text: "Your order is confirmed as soon as you pay." },
  { icon: PackageCheck, title: "Track every step", text: "Cancel any time before we start packing." },
];

export function ProductDetailView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error, refetch } = useGetProduct(id);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="container-page py-10">
        {notFound ? (
          <EmptyState
            title="This product isn't available"
            message="It may have sold out for good or been removed from the shop."
            action={
              <Link href={shopUrl()} className={buttonVariants()}>
                <ArrowLeft aria-hidden="true" />
                Back to the shop
              </Link>
            }
          />
        ) : (
          <ErrorState title="Couldn't load this product" message={error?.message} onRetry={() => void refetch()} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-14 pb-16 sm:gap-20">
      <ProductOverview product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}

function ProductOverview({ product }: { product: IProduct }) {
  const theme = categoryTheme(product.category.name);
  const Icon = theme.icon;

  return (
    <div className="container-page flex flex-col gap-6 pt-6 sm:pt-8">
      <PageBreadcrumbs
        items={[
          { label: "Shop", href: shopUrl() },
          { label: product.category.name, href: shopUrl({ category: product.category.id }) },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <ProductImage
            name={product.name}
            categoryName={product.category.name}
            alt={product.name}
            eager
            sizes="(min-width: 1024px) 600px, 100vw"
            muted={product.stockStatus === "OUT_OF_STOCK"}
            className="rounded-3xl shadow-soft ring-1 ring-border"
            imageClassName="p-8 sm:p-12"
          />
          {product.stockStatus === "LOW_STOCK" && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-tomato px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
              <Flame className="size-4" aria-hidden="true" />
              Low stock — order soon
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:py-4">
          <div className="flex flex-col gap-3">
            <Link
              href={shopUrl({ category: product.category.id })}
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80",
                TONE_CLASSES[theme.tone].chip,
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {product.category.name}
            </Link>
            <h1 className="font-display text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">{product.name}</h1>
            <p className="text-xs text-muted-foreground">SKU {product.sku}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="numeric font-heading text-4xl font-bold">{formatMoney(product.price)}</p>
            <StatusBadge status={product.stockStatus} className="text-sm" />
          </div>

          <PurchasePanel product={product} />

          <ul className="grid gap-3 border-t pt-6 sm:grid-cols-2">
            {PERKS.map(({ icon: PerkIcon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <PerkIcon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{title}</span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RelatedProducts({ product }: { product: IProduct }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({
    categoryId: product.category.id,
    limit: RELATED_LIMIT + 1,
  });
  const related = data?.data.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT);

  // Aisle mein sirf yahi product ho to shelf ka koi faida nahi
  if (!isLoading && !isError && !related?.length) return null;

  return (
    <div className="container-page">
      <ProductRail
        title={`More from ${product.category.name}`}
        href={shopUrl({ category: product.category.id })}
        products={related}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
      />
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container-page flex flex-col gap-6 pt-6 sm:pt-8" aria-label="Loading" aria-busy="true">
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col gap-4 lg:py-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
