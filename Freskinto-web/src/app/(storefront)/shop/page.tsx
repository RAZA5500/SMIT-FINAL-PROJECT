import { Suspense } from "react";
import { ShopView, ShopViewSkeleton } from "./(components)/ShopView";

/** useSearchParams (URL filters) ko Suspense boundary chahiye */
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopViewSkeleton />}>
      <ShopView />
    </Suspense>
  );
}
