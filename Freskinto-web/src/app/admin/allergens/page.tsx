import type { Metadata } from "next";
import { AllergensView } from "./(components)/AllergensView";

export const metadata: Metadata = {
  title: "Allergens",
};

/** Static mock screen (user decision) — sample allergen declarations */
export default function AdminAllergensPage() {
  return <AllergensView />;
}
