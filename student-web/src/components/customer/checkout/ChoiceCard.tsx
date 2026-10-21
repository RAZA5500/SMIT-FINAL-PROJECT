import type { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Right side (e.g. "Free" pill, Default badge) */
  aside?: ReactNode;
  className?: string;
}

/** Radio as a big tappable card — label poora card hai, checked par brand ring */
export function ChoiceCard({ value, title, description, icon, aside, className }: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/25",
        "has-data-checked:border-primary has-data-checked:bg-brand-soft/50 has-data-checked:ring-1 has-data-checked:ring-primary",
        "has-focus-visible:ring-3 has-focus-visible:ring-ring/30",
        className,
      )}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-brand [&_svg]:size-5">
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </span>
      {aside}
    </label>
  );
}
