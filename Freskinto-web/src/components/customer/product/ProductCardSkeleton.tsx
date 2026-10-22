import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Product card ka loading state — card jaisi shakal (FLOW-MD 07 §7) */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("h-full gap-0 py-0", className)}>
      <Skeleton className={cn("aspect-square w-full rounded-none")} />
      <Stack gap="2.5" className={cn("p-3.5")}>
        <Skeleton className={cn("h-3 w-1/3")} />
        <Skeleton className={cn("h-4 w-4/5")} />
        <Skeleton className={cn("h-12 w-24 rounded-lg")} />
        <Skeleton className={cn("h-9 w-full rounded-full")} />
      </Stack>
    </Card>
  );
}

export function ProductGridSkeleton({ count, className }: { count: number; className?: string }) {
  return (
    <Grid aria-label="Loading products" aria-busy="true" className={cn(className)}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </Grid>
  );
}
