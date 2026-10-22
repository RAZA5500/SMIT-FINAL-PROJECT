import type { Metadata } from "next";
import { SettingsView } from "./(components)/SettingsView";

export const metadata: Metadata = {
  title: "Settings",
};

/** Static mock screen (user decision) — kuch save nahi hota */
export default function AdminSettingsPage() {
  return <SettingsView />;
}
