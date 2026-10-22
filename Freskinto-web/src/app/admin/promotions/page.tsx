import type { Metadata } from "next";
import { PromotionsView } from "./(components)/PromotionsView";

export const metadata: Metadata = {
  title: "Promotions",
};

/** Static mock screen (user decision) — sample banners */
export default function AdminPromotionsPage() {
  return <PromotionsView />;
}
