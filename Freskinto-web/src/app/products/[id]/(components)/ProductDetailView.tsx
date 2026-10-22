"use client";

import { ArrowLeft, Clock, PackageCheck, Store, Truck } from "lucide-react";
import { ProductBadges } from "@/components/customer/product/ProductCard";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ProductListing } from "@/components/customer/ProductListing";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { AisleTag } from "@/components/shared/AisleTag";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { Skeleton } from "@/components/ui/skeleton";
import { STORE } from "@/constants/store";
import { ApiError } from "@/lib/api";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProduct, useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { PurchasePanel } from "./PurchasePanel";

const RELATED_LIMIT = 4;

/** Store ke asli wade — FLOW-MD 01 (shipping 0, pickup slot, cancel before packing) */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order — no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Choose a collection time at checkout." },
  { icon: Clock, title: "Pay in minutes", text: `Confirmed as soon as you pay (within ${STORE.paymentWindowMinutes} minutes).` },
  { icon: PackageCheck, title: "Track every step", text: "Cancel any time before we start packing." },
];

export function ProductDetailView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error, refetch } = useGetProduct(id);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="page-container py-12">
        {notFound ? (
          <EmptyState
            title="This product isn't available"
            message="It may have sold out for good or been removed from the shop."
            action={
              <ButtonLink href={shopUrl()}>
                <ArrowLeft aria-hidden="true" />
                Back to the shop
              </ButtonLink>
            }
          />
        ) : (
          <ErrorState title="Couldn't load this product" message={error?.message} onRetry={() => void refetch()} />
        )}
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col gap-16 py-8 sm:py-10">
      <ProductOverview product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}

function ProductOverview({ product }: { product: IProduct }) {
  const { aisles } = useAisles();
  const aisleIndex = aisleIndexOf(aisles, product.category.id);

  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumbs
        root={{ label: "Home", href: publicRoutes.home }}
        items={[
          { label: "Shop", href: shopUrl() },
          { label: product.category.name, href: shopUrl({ category: product.category.id }) },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="relative lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <ProductImage
              name={product.name}
              categoryName={product.category.name}
              alt={product.name}
              eager
              sizes="(min-width: 1024px) 680px, 100vw"
              muted={product.stockStatus === "OUT_OF_STOCK"}
              imageClassName="p-10 sm:p-16"
            />
          </div>
          <ProductBadges product={product} className="absolute top-4 left-4" />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5 lg:py-2">
          <div className="flex flex-col gap-3">
            <TextLink href={shopUrl({ category: product.category.id })} className="w-fit hover:no-underline">
              <AisleTag index={aisleIndex} label={product.category.name} />
            </TextLink>
            <h1 className="font-heading text-fs-40 text-foreground lg:text-fs-48">{product.name}</h1>
            <p className="font-mono text-fs-12 text-muted-foreground">SKU {product.sku}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Price amount={product.price} size="xl" tone="brand" className="text-fs-40" />
            <StatusBadge status={product.stockStatus} />
          </div>

          <PurchasePanel product={product} />

          <ul className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <InfoRow icon={<Icon aria-hidden="true" />} label={title}>
                  {text}
                </InfoRow>
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
    <section aria-label="Related products" className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Same aisle"
        title={`More from ${product.category.name}`}
        href={shopUrl({ category: product.category.id })}
      />
      <ProductListing
        products={related}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
        skeleton={<ProductGridSkeleton count={RELATED_LIMIT} />}
      />
    </section>
  );
}

function ProductDetailSkeleton() {
  return (
    <div aria-label="Loading" aria-busy="true" className="page-container flex flex-col gap-6 py-8 sm:py-10">
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-3xl lg:col-span-7" />
        <div className="flex flex-col gap-4 lg:col-span-5 lg:py-2">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-16 w-36 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
