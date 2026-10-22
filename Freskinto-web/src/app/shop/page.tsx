import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "./(components)/ShopView";
import { ShopViewSkeleton } from "./(components)/ShopViewSkeleton";

export const metadata: Metadata = {
  title: "Shop",
  description: "Fresh produce, poultry, dairy and everyday essentials — free delivery on every order.",
};

/** Filters URL (`useSearchParams`) se aate hain — isliye Suspense */
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopViewSkeleton />}>
      <ShopView />
    </Suspense>
  );
}
