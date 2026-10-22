import { Text } from "@/components/ui/typography";

/** Label ke saath "*" — screen readers ke liye `required` attribute kaafi hai */
export function RequiredMark() {
  return (
    <Text as="span" tone="destructive" aria-hidden="true" className="leading-none">
      *
    </Text>
  );
}
