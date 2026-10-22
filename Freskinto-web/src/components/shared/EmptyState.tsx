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
    <Empty className={cn("gap-5 border border-dashed border-border px-6 py-14", className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia className="mb-1 size-11 rounded-lg bg-muted text-muted-foreground [&_svg]:size-5">
          {icon ?? <Inbox aria-hidden="true" />}
        </EmptyMedia>
        <EmptyTitle className="text-base font-semibold">{title}</EmptyTitle>
        {message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent className="flex-row flex-wrap justify-center gap-3">{action}</EmptyContent>}
    </Empty>
  );
}
