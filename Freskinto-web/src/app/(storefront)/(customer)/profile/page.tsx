import type { Metadata } from "next";
import { CustomerProfileView } from "./(components)/CustomerProfileView";

export const metadata: Metadata = {
  title: "My profile",
  description: "View and manage your Freskinto customer account.",
};

export default function ProfilePage() {
  return <CustomerProfileView />;
}
