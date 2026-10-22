import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView, ShopViewSkeleton } from "./(components)/ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse fresh fruit & veg, poultry, dairy and everyday essentials — free delivery on every order.",
};

/** useSearchParams (URL filters) ko Suspense boundary chahiye */
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopViewSkeleton />}>
      <ShopView />
    </Suspense>
  );
}
