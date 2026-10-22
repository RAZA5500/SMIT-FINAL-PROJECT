import { ArrowLeft } from "lucide-react";
import type { FormEventHandler, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { cn } from "@/lib/utils";
import { AdminPage } from "./AdminPage";

interface AdminFormPageProps {
  title: string;
  description?: ReactNode;
  backHref: string;
  backLabel?: string;
  formId: string;
  /** Live forms: RHF `handleSubmit`; static mocks: kuch nahi (submit block) */
  onSubmit?: FormEventHandler<HTMLFormElement>;
  /** Cancel / Back / Next / Save buttons */
  footer: ReactNode;
  /** Right column — e.g. live preview */
  aside?: ReactNode;
  demo?: boolean;
  children: ReactNode;
}

/** Admin create/edit screens: form card + optional aside + sticky action bar */
export function AdminFormPage({
  title,
  description,
  backHref,
  backLabel = "Back",
  formId,
  onSubmit,
  footer,
  aside,
  children,
}: AdminFormPageProps) {
  return (
    <AdminPage
      title={title}
      description={description}
      actions={
        <ButtonLink href={backHref} variant="outline">
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          {backLabel}
        </ButtonLink>
      }
      className={cn("pb-0 sm:pb-0 lg:pb-0")}
    >
      <div className={cn("grid items-start gap-6", aside && "xl:grid-cols-3")}>
        <Card className={cn(aside && "xl:col-span-2")}>
          <CardContent>
            <form id={formId} onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
              {children}
            </form>
          </CardContent>
        </Card>
        {aside && (
          <aside className={cn("flex flex-col gap-4 xl:sticky xl:top-24")}>
            {aside}
          </aside>
        )}
      </div>
      <div className={cn("sticky bottom-0 z-20 -mx-4 mt-auto border-t bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8")}>
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {footer}
        </div>
      </div>
    </AdminPage>
  );
}
