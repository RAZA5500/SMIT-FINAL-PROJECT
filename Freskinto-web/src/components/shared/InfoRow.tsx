import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}

/** Icon chip + chhota label + value — order details, profile, customer modal */
export function InfoRow({ icon, label, children, className }: InfoRowProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-green [&_svg]:size-4"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-fs-12 text-muted-foreground">{label}</p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}
