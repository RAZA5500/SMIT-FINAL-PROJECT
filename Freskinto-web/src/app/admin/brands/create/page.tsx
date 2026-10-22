import type { Metadata } from "next";
import { BrandForm } from "./(components)/BrandForm";

export const metadata: Metadata = {
  title: "New brand",
};

/** Static mock screen (user decision) — form kuch save nahi karta */
export default function AdminCreateBrandPage() {
  return <BrandForm />;
}
