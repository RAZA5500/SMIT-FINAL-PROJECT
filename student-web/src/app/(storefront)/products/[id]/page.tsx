import type { Metadata } from "next";
import { API_ENDPOINTS } from "@/lib/api";
import { ProductDetailView } from "./(components)/ProductDetailView";

/** Tab title product ke naam se — API na mile to generic title (page phir bhi client par load hota hai) */
export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await fetch(API_ENDPOINTS.products.detail(id), { signal: AbortSignal.timeout(2000) });
    if (!response.ok) return { title: "Product" };
    const product = (await response.json()) as { name?: string; category?: { name?: string } };
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
