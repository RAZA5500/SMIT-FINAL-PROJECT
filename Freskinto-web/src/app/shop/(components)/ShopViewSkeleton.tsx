import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";

/** Server HTML aur pehla client render — page ke Suspense fallback mein bhi yahi */
export function ShopViewSkeleton() {
  return (
    <Container aria-busy="true" aria-label="Loading shop" className="flex flex-col gap-6 py-6 sm:py-8">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-8 w-full" />
      <Flex align="start" gap="8">
        <Skeleton className="hidden h-96 w-64 shrink-0 rounded-xl lg:block" />
        <ProductGridSkeleton count={8} className="min-w-0 flex-1" />
      </Flex>
    </Container>
  );
}
