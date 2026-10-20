import { Skeleton } from "@/components/ui/skeleton";

/** Product grid ka loading state — card jaisi shakal (FLOW-MD 07 §7) */
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-row overflow-hidden rounded-10 border border-gray-100 bg-white sm:flex-col">
      <Skeleton className="h-36 w-36 shrink-0 rounded-none sm:aspect-square sm:h-auto sm:w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-3 w-1/3" />
        <div className="mt-auto flex gap-2 pt-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={className} aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
