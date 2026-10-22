import { FlaskConical } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Stack } from "@/components/ui/flex";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface AdminPageProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  /** Static mock screen — "Sample data" label (user decision: backend se connected nahi) */
  demo?: boolean;
  children: ReactNode;
  className?: string;
}

/** Har admin screen ka frame — heading, actions, content */
export function AdminPage({ title, description, eyebrow, meta, actions, demo = false, children, className }: AdminPageProps) {
  return (
    <Stack gap="6" className={cn("flex-1 p-4 sm:p-6 lg:p-8", className)}>
      <PageHeader
        size="2"
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
        meta={
          demo || meta ? (
            <>
              {demo && (
                <Badge variant="warning">
                  <FlaskConical aria-hidden="true" />
                  Sample data
                </Badge>
              )}
              {meta}
            </>
          ) : undefined
        }
      />
      {children}
    </Stack>
  );
}
