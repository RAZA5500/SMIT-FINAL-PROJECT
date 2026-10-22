import type { Metadata } from "next";
import { productService } from "@/services/products";
import { ProductDetailView } from "./(components)/ProductDetailView";

/** Tab title product ke naam se — API na mile to generic title (page phir bhi client par load hota hai) */
export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await productService.get(id, AbortSignal.timeout(2000));
    return {
      title: product.name ?? "Product",
      description: product.name
        ? `Buy ${product.name}${product.category?.name ? ` from our ${product.category.name} aisle` : ""} — free delivery on every order.`
        : undefined,
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <ProductDetailView id={id} />;
}
