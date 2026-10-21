import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Khali list — hamesha agla qadam batao (FLOW-MD 07 §7) */
export function EmptyState({ title = "Nothing here yet", message, icon, action, className }: EmptyStateProps) {
  return (
    <Empty className={cn("py-14", className)}>
      <EmptyHeader>
        <EmptyMedia className="relative mb-3">
          <span className="absolute -inset-3 rounded-full bg-lime-soft" aria-hidden="true" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-card text-brand shadow-soft ring-1 ring-border [&_svg]:size-6">
            {icon ?? <Inbox aria-hidden="true" />}
          </span>
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
        {message && <EmptyDescription className="max-w-sm">{message}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent className="pt-1">{action}</EmptyContent>}
    </Empty>
  );
}
