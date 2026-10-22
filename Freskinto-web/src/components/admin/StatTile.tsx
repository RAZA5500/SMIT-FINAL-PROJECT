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
  /** Icon tile ka rang (bg + text tokens) */
  tone?: string;
  isLoading?: boolean;
  /** Diya ho to tile ek filter button ban jati hai */
  onSelect?: () => void;
  active?: boolean;
}

/** KPI tile: icon chip, uppercase micro label, bada number, ek line hint */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "bg-plum-soft text-primary",
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
        className={cn("size-12 shrink-0 rounded-2xl transition-transform group-hover/stat:-rotate-6 [&_svg]:size-5", tone)}
      >
        <Icon />
      </Flex>
      <Stack as="span" gap="1" className="min-w-0 text-left">
        <Text as="span" variant="eyebrow" tone="muted">
          {label}
        </Text>
        {isLoading ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <Text as="span" family="heading" weight="bold" numeric className="text-3xl leading-none tracking-tight">
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
    return <Card className="group/stat flex-row items-center gap-4 rounded-3xl p-4">{body}</Card>;
  }

  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "group/stat h-auto w-full justify-start gap-4 rounded-3xl bg-card p-4 whitespace-normal shadow-soft hover:-translate-y-0.5 hover:bg-card hover:shadow-lift",
        active && "border-primary ring-2 ring-primary/30",
      )}
    >
      {body}
    </Button>
  );
}
