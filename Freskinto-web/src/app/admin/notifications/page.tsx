import type { Metadata } from "next";
import { NotificationsView } from "./(components)/NotificationsView";

export const metadata: Metadata = {
  title: "Notifications",
};

/** Static mock screen (user decision) — sample alerts, sirf local state */
export default function AdminNotificationsPage() {
  return <NotificationsView />;
}
