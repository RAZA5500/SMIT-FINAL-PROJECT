import type { Metadata } from "next";
import { BrandsView } from "./(components)/BrandsView";

// Title page par (layout mein string title child routes ka "· Freskinto Admin" template mita deta hai)
export const metadata: Metadata = {
  title: "Brands",
};

/** Static mock screen (user decision) — sample brands */
export default function AdminBrandsPage() {
  return <BrandsView />;
}
