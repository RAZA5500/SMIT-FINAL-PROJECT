import { CloudOff, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
    <div
      role="alert"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-5 rounded-15 border border-dashed border-destructive/30 bg-card/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-tomato-soft text-destructive [&_svg]:size-7"
      >
        <CloudOff />
      </span>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-heading text-fs-20 font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {(action || onRetry) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action ?? (
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
