import type { Metadata } from "next";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { HomeView } from "./(components)/HomeView";

export const metadata: Metadata = {
  title: "Freskinto — Fresh From The Market, Delivered Free",
  description:
    "Order farm-fresh produce, tender meats, artisanal bakery, and dairy essentials delivered straight to your door with free delivery on every order.",
};

export default function HomePage() {
  return (
    <CustomerShell>
      <HomeView />
    </CustomerShell>
  );
}
