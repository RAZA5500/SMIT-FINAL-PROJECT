import type { Metadata } from "next";
import { CouponsView } from "./(components)/CouponsView";

export const metadata: Metadata = {
  title: "Coupons",
};

/** Static mock screen (user decision) — sample coupons */
export default function AdminCouponsPage() {
  return <CouponsView />;
}
