import { CircleAlert } from "lucide-react";

/** Field ke neeche error (role=alert, `${id}-error`) ya hint (`${id}-hint`) — error ko priority */
export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-destructive">
        <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
        {error}
      </p>
    );
  }
  if (!hint) return null;
  return (
    <p id={`${id}-hint`} className="text-xs text-muted-foreground">
      {hint}
    </p>
  );
}
