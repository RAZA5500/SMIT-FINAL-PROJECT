import type { Metadata } from "next";
import { EditProductView } from "../../(components)/EditProductView";

export const metadata: Metadata = {
  title: "Edit product",
};

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  return <EditProductView id={id} />;
}
