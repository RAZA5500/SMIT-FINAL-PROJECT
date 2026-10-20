/** Invalid submit par pehli ghalat field tak scroll + focus (FLOW-MD 07 §6, 09 §1.4) */
export function scrollToFirstError(formId: string): void {
  const field = document
    .getElementById(formId)
    ?.querySelector<HTMLElement>("[aria-invalid='true']");
  if (!field) return;
  field.scrollIntoView({ behavior: "smooth", block: "center" });
  field.focus({ preventScroll: true });
}
