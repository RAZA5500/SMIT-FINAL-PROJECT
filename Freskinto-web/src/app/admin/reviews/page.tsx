import type { Metadata } from "next";
import { ReviewsView } from "./(components)/ReviewsView";

export const metadata: Metadata = {
  title: "Reviews",
};

/** Static mock screen (user decision) — sample product reviews */
export default function AdminReviewsPage() {
  return <ReviewsView />;
}
