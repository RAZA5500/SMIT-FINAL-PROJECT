import type { Metadata } from "next";
import { ProductForm } from "../(components)/ProductForm";

export const metadata: Metadata = {
  title: "New product",
};

export default function CreateProductPage() {
  return <ProductForm />;
}
