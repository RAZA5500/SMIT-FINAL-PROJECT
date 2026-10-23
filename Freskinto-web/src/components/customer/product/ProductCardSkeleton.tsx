import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PRODUCT_GRID_CLASS } from "./product-grid";

/** ProductCard ka same-size placeholder — layout shift nahi */
export function ProductCardSkeleton() {
  return (
    <Card className="h-full gap-0 rounded-[1.9rem] p-2">
      <Skeleton className="aspect-square w-full rounded-[1.4rem]" />
      <Stack gap="3" className="flex-1 px-2.5 pt-3.5 pb-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-11 w-4/5" />
        <Flex align="end" justify="between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="size-11 rounded-full" />
        </Flex>
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
