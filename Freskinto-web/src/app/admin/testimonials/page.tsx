import type { Metadata } from "next";
import { TestimonialsView } from "./(components)/TestimonialsView";

export const metadata: Metadata = {
  title: "Testimonials",
};

/** Static mock screen (user decision) — featured toggle sirf local state */
export default function AdminTestimonialsPage() {
  return <TestimonialsView />;
}
