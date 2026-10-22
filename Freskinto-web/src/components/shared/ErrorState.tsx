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
      className={cn("gap-5 border-2 border-dashed border-destructive/30 bg-card/60 px-6 py-14", className)}
    >
      <EmptyHeader className="gap-3">
        <EmptyMedia className="mb-1 size-16 rotate-6 rounded-2xl bg-destructive-soft text-destructive [&_svg]:size-7">
          <CloudOff aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="font-heading text-xl font-bold">{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {(action || onRetry) && (
        <EmptyContent className="flex-row flex-wrap justify-center gap-3">
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
