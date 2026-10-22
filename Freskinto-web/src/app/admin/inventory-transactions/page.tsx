import type { Metadata } from "next";
import { StockMovementsView } from "./(components)/StockMovementsView";

export const metadata: Metadata = {
  title: "Stock movements",
};

/** Static mock screen (user decision) — sample stock movements */
export default function AdminInventoryTransactionsPage() {
  return <StockMovementsView />;
}
