import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/** Label ke saath "*" — screen readers ke liye `required` attribute kaafi hai */
export function RequiredMark() {
  return (
    <Text as="span" tone="destructive" aria-hidden="true" className={cn("-ml-1 leading-none")}>
      *
    </Text>
  );
}
