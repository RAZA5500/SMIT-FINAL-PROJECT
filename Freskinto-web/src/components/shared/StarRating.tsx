import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** 0–5 */
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

/** 5 sitaron wali rating — screen reader ko ek hi label milta hai */
export function StarRating({ rating, size = "md", className }: StarRatingProps) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "size-3.5" : "size-4",
            i < rating ? "fill-saffron text-saffron" : "fill-muted text-muted",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
