import type { Metadata } from "next";
import { ProductsView } from "./(components)/ProductsView";

// Title page par (layout mein string title child routes ka "· Freskinto Admin" template mita deta hai)
export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return <ProductsView />;
}
