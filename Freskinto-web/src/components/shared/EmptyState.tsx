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
        <EmptyMedia
          className={cn(
            "size-16 rounded-full border border-dashed border-input bg-background text-brand [&_svg]:size-6",
          )}
        >
          {icon ?? <Inbox aria-hidden="true" />}
        </EmptyMedia>
        <EmptyTitle className={cn("text-xl font-semibold")}>{title}</EmptyTitle>
        {message && <EmptyDescription className={cn("max-w-sm")}>{message}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
