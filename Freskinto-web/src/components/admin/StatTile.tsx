import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { NumberTicker } from "@/components/ui/number-ticker";
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

/** KPI tile: icon chip, label, number (0 se ginti), ek line hint */
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
        className={cn("size-11 shrink-0 rounded-2xl shadow-xs [&_svg]:size-5", tone)}
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
          <Text as="span" weight="semibold" numeric className="font-display text-2xl leading-tight tracking-[-0.04em]">
            {/* Ginti 0 se upar chadhti hai — sirf number par; text values (e.g. "£12.40") waise hi */}
            {typeof value === "number" ? <NumberTicker value={value} duration={1200} /> : (value ?? "—")}
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
    return <Card className="group/tile flex-row items-start gap-3.5 rounded-[1.5rem] p-4.5 transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-soft">{body}</Card>;
  }

  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "h-auto w-full items-start justify-start gap-3 rounded-[1.5rem] bg-card p-4 font-normal whitespace-normal hover:bg-muted/40",
        active && "border-brand/50 bg-brand-soft/50 hover:bg-brand-soft/50 dark:bg-brand/10 dark:hover:bg-brand/10",
      )}
    >
      {body}
    </Button>
  );
}
