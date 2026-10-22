import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PRODUCT_GRID_CLASS } from "./product-grid";

/** ProductCard ka same-size placeholder — layout shift nahi */
export function ProductCardSkeleton() {
  return (
    <Card className="h-full gap-0 py-0">
      <Box className="p-2 pb-0">
        <Skeleton className="aspect-square w-full rounded-lg" />
      </Box>
      <Stack gap="3" className="flex-1 p-3 sm:p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-9 w-full" />
      </Stack>
    </Card>
  );
}

/** Shop / rails ka initial loading — `ProductListing` ko `skeleton` prop se diya jata hai */
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <Box aria-label="Loading products" aria-busy="true" className={cn(PRODUCT_GRID_CLASS, className)}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </Box>
  );
}
