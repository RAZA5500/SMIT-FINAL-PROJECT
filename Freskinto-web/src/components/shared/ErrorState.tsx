import { CloudOff, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Custom action; na ho to `onRetry` ka "Try again" button */
  action?: ReactNode;
  onRetry?: () => void;
  className?: string;
}

/** Request fail ho to blank/crash screen ki jagah (FLOW-MD 13 Phase 16) */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now.",
  action,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Empty
      role="alert"
      className={cn("gap-5 rounded-[2rem] border border-dashed border-destructive/25 bg-destructive-soft/30 px-6 py-14 shadow-xs", className)}
    >
      <EmptyHeader className="gap-3">
        <EmptyMedia className="mb-1 size-14 rounded-2xl bg-destructive-soft text-destructive shadow-xs [&_svg]:size-6">
          <CloudOff aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
        <EmptyDescription className="text-sm text-muted-foreground leading-relaxed">{message}</EmptyDescription>
      </EmptyHeader>
      {(action || onRetry) && (
        <EmptyContent className="flex-row flex-wrap justify-center gap-3 pt-1">
          {action ?? (
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
}
