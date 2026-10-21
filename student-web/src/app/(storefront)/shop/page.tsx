import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ShopView } from "./(components)/ShopView";

/** useSearchParams (URL filters) ko Suspense boundary chahiye */
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-8">
          <ProductGridSkeleton count={8} className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4" />
        </div>
      }
    >
      <ShopView />
    </Suspense>
  );
}
