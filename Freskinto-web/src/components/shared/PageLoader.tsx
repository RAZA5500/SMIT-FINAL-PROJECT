import { Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { LogoMark } from "./Logo";

/** Poore page ka loading (AuthGuard role verify kar raha ho) */
export function PageLoader() {
  return (
    <Stack
      align="center"
      justify="center"
      gap="5"
      aria-busy="true"
      aria-label="Loading"
      className="min-h-dvh flex-1"
    >
      <LogoMark size="lg" className="animate-bounce" />
      <Text as="span" variant="eyebrow" tone="muted" aria-hidden="true">
        Opening the market…
      </Text>
    </Stack>
  );
}
