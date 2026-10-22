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
    <Empty className={cn("gap-5 border-2 border-dashed border-input bg-card/60 px-6 py-14", className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia className="mb-1 size-16 -rotate-6 rounded-2xl border-2 border-pop bg-lime text-lime-foreground shadow-pop-sm [&_svg]:size-7">
          {icon ?? <Inbox aria-hidden="true" />}
        </EmptyMedia>
        <EmptyTitle className="font-heading text-xl font-bold">{title}</EmptyTitle>
        {message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent className="flex-row flex-wrap justify-center gap-3">{action}</EmptyContent>}
    </Empty>
  );
}
