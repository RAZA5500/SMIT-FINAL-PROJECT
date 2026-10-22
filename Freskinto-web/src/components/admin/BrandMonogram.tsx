import { Flex } from "@/components/ui/flex";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Brand "logo" — initials in the serif on a quiet tile (no real logos in the demo) */
export function BrandMonogram({ name, className }: { name: string; className?: string }) {
  return (
    <Flex
      as="span"
      aria-hidden="true"
      align="center"
      justify="center"
      className={cn(
        "size-10 shrink-0 rounded-xl border bg-muted font-heading text-sm font-semibold text-brand",
        className,
      )}
    >
      {initials(name || "?")}
    </Flex>
  );
}
