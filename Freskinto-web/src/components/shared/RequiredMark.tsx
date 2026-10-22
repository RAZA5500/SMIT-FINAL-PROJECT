/** Label ke saath "*" — screen readers ke liye `required` attribute kaafi hai */
export function RequiredMark() {
  return (
    <span aria-hidden="true" className="leading-none text-destructive">
      *
    </span>
  );
}
