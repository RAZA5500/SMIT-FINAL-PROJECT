import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  /** Contextual illustration/icon — default Inbox */
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Khali list — hamesha agla qadam batao (FLOW-MD 07 §7). shadcn `Empty` par bana. */
export function EmptyState({ title = "Nothing here yet", message, icon, action, className }: EmptyStateProps) {
  return (
    <Empty className={cn("gap-5 rounded-[2rem] border border-dashed border-border/80 bg-card/40 px-6 py-14 shadow-xs", className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia className="mb-1 size-14 rounded-2xl bg-muted/80 text-muted-foreground shadow-xs [&_svg]:size-6">
          {icon ?? <Inbox aria-hidden="true" />}
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
        {message && <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">{message}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent className="flex-row flex-wrap justify-center gap-3 pt-1">{action}</EmptyContent>}
    </Empty>
  );
}
