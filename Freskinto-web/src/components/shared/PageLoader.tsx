import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

/** Poore page ka loading (AuthGuard role verify kar raha ho) */
export function PageLoader() {
  return (
    <Flex
      direction="col"
      align="center"
      justify="center"
      gap="4"
      aria-busy="true"
      aria-label="Loading"
      className={cn("min-h-dvh flex-1")}
    >
      <LogoMark size="lg" className={cn("animate-pulse")} />
      <Text variant="code" tone="muted" aria-hidden="true" className={cn("uppercase")}>
        Opening the market…
      </Text>
    </Flex>
  );
}
