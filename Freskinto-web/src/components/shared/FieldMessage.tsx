import { FieldDescription, FieldError } from "@/components/ui/field";

/** Field ke neeche error (role=alert, `${id}-error`) ya hint (`${id}-hint`) — error ko priority */
export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) return <FieldError id={`${id}-error`}>{error}</FieldError>;
  if (!hint) return null;
  return <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>;
}

/** `aria-describedby` jo FieldMessage ke ids se match kare */
export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}
