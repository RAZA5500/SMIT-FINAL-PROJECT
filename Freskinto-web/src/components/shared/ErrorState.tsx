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
        <EmptyMedia
          className={cn(
            "size-16 rounded-full border border-dashed border-destructive/40 bg-background text-destructive [&_svg]:size-6",
          )}
        >
          <CloudOff aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className={cn("text-xl font-semibold")}>{title}</EmptyTitle>
        <EmptyDescription className={cn("max-w-sm")}>{message}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            Try again
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
