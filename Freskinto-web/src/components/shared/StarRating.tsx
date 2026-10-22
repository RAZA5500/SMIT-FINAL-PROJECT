import { Star } from "lucide-react";
import { Flex } from "@/components/ui/flex";
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
    <Flex as="span" inline align="center" gap="0.5" role="img" aria-label={`${rating} out of 5 stars`} className={cn(className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            size === "sm" ? "size-3.5" : "size-4",
            i < rating ? "fill-saffron text-saffron" : "fill-muted text-muted",
          )}
        />
      ))}
    </Flex>
  );
}
