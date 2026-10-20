import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-icon-bg-green text-brand-green">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {message && <p className="max-w-sm text-sm text-gray-500">{message}</p>}
      </div>
      {action}
    </div>
  );
}
