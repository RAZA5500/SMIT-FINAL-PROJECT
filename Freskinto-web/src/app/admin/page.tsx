import type { Metadata } from "next";
import { AdminOverviewView } from "./(components)/AdminOverviewView";

export const metadata: Metadata = { title: "Overview" };

/** Admin ka front door: aaj ki queue, order status chart, stock alerts — sab asli API counts */
export default function AdminHomePage() {
  return <AdminOverviewView />;
}
