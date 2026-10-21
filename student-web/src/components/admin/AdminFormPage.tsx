import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
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
  demo,
  children,
}: AdminFormPageProps) {
  return (
    <AdminPage
      title={title}
      description={description}
      demo={demo}
      actions={
        <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft aria-hidden="true" />
          {backLabel}
        </Link>
      }
      className="pb-0 sm:pb-0 lg:pb-0"
    >
      <div className={cn("grid items-start gap-6", aside && "xl:grid-cols-3")}>
        <form
          id={formId}
          noValidate
          onSubmit={onSubmit ?? ((event) => event.preventDefault())}
          className={cn(
            "flex flex-col gap-6 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6",
            aside && "xl:col-span-2",
          )}
        >
          {children}
        </form>
        {aside && <aside className="flex flex-col gap-4 xl:sticky xl:top-24">{aside}</aside>}
      </div>
      <div className="sticky bottom-0 z-20 -mx-4 mt-auto border-t bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-end gap-2.5">{footer}</div>
      </div>
    </AdminPage>
  );
}
