import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Request fail ho to blank/crash screen ki jagah (FLOW-MD 13 Phase 16) */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Empty role="alert" className={cn("py-14", className)}>
      <EmptyHeader>
        <EmptyMedia className="relative mb-3">
          <span className="absolute -inset-3 rounded-full bg-tomato-soft" aria-hidden="true" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-card text-destructive shadow-soft ring-1 ring-border">
            <CloudOff className="size-6" aria-hidden="true" />
          </span>
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
        <EmptyDescription className="max-w-sm">{message}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent className="pt-1">
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
