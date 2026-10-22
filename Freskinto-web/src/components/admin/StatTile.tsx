import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number | undefined;
  hint?: string;
  icon: LucideIcon;
  /** Icon tile ka rang (bg + text tokens) — sirf status ke liye rang, warna grey */
  tone?: string;
  isLoading?: boolean;
  /** Diya ho to tile ek filter button ban jati hai */
  onSelect?: () => void;
  active?: boolean;
}

/** KPI tile: icon chip, label, number, ek line hint */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "bg-muted text-muted-foreground",
  isLoading,
  onSelect,
  active,
}: StatTileProps) {
  const body = (
    <>
      <Flex
        as="span"
        align="center"
        justify="center"
        aria-hidden="true"
        className={cn("size-9 shrink-0 rounded-md [&_svg]:size-4", tone)}
      >
        <Icon />
      </Flex>
      <Stack as="span" gap="1" className="min-w-0 text-left">
        <Text as="span" tone="muted" className="text-fs-13">
          {label}
        </Text>
        {isLoading ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <Text as="span" weight="semibold" numeric className="text-2xl leading-tight tracking-tight">
            {value ?? "—"}
          </Text>
        )}
        {hint && (
          <Text as="span" tone="muted" weight="normal" className="text-fs-12">
            {hint}
          </Text>
        )}
      </Stack>
    </>
  );

  if (!onSelect) {
    return <Card className="flex-row items-start gap-3 p-4">{body}</Card>;
  }

  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "h-auto w-full items-start justify-start gap-3 rounded-xl bg-card p-4 font-normal whitespace-normal hover:bg-muted/40",
        active && "border-primary/60 bg-accent/40 hover:bg-accent/40",
      )}
    >
      {body}
    </Button>
  );
}
