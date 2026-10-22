import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  /** Contextual illustration/icon — default Inbox */
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Khali list — hamesha agla qadam batao (FLOW-MD 07 §7) */
export function EmptyState({ title = "Nothing here yet", message, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-5 rounded-15 border border-dashed border-input bg-card/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand-green [&_svg]:size-7"
      >
        {icon ?? <Inbox />}
      </span>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-heading text-fs-20 font-semibold text-foreground">{title}</h3>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
