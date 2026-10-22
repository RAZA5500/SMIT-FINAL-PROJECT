import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PRODUCT_GRID_CLASS } from "./product-grid";

/** ProductCard ka same-size placeholder — layout shift nahi */
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-15 border border-border bg-card shadow-soft">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

/** Shop / rails ka initial loading — `ProductListing` ko `skeleton` prop se diya jata hai */
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div aria-label="Loading products" aria-busy="true" className={cn(PRODUCT_GRID_CLASS, className)}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
