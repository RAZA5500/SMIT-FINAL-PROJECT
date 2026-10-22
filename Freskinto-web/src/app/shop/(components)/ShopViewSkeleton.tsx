import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";

/** Server HTML aur pehla client render — page ke Suspense fallback mein bhi yahi */
export function ShopViewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading shop" className="page-container flex flex-col gap-6 py-6 sm:py-8">
      <Skeleton className="h-80 w-full rounded-3xl sm:h-96" />
      <Skeleton className="h-11 w-full rounded-full" />
      <div className="flex items-start gap-8">
        <Skeleton className="hidden h-96 w-72 shrink-0 rounded-15 lg:block" />
        <ProductGridSkeleton count={8} className="min-w-0 flex-1" />
      </div>
    </div>
  );
}
