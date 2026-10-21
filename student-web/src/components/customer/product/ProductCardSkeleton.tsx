import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Product grid ka loading state — card jaisi shakal (FLOW-MD 07 §7) */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col rounded-2xl bg-card p-2 ring-1 ring-border", className)}>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="flex flex-col gap-2 px-1.5 pt-3 pb-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="mt-1 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count, className }: { count: number; className?: string }) {
  return (
    <div className={className} aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
