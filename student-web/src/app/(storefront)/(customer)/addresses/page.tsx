import type { Metadata } from "next";
import { AddressesView } from "./(components)/AddressesView";

export const metadata: Metadata = {
  title: "Addresses",
};

export default function AddressesPage() {
  return <AddressesView />;
}
