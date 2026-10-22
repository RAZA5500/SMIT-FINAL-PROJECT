import { Clock, Store, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/shared/TextLink";

/** Sirf asli wade (FLOW-MD 01): shipping hamesha 0, pickup slot, 5 minute payment window */
const PROMISES = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect at a time you choose" },
  { icon: Clock, text: `Pay within ${STORE.paymentWindowMinutes} minutes to confirm` },
];

/** Thin mono strip above the header */
export function UtilityBar() {
  return (
    <Flex as="aside" aria-label="Store promises" className={cn("border-b border-border/80 bg-order-card-bg")}>
      <Container className={cn("flex h-8 items-center justify-between gap-6")}>
        <Flex align="center" gap="6" className={cn("min-w-0")}>
          {PROMISES.map(({ icon: Icon, text }, index) => (
            <Flex
              key={text}
              as="span"
              align="center"
              gap="2"
              className={cn("min-w-0", index > 0 && "hidden md:flex")}
            >
              <Icon aria-hidden="true" className={cn("size-3.5 shrink-0 text-brand-green")} />
              <Text as="span" variant="small" className={cn("truncate text-xs font-medium text-foreground/85")}>
                {text}
              </Text>
            </Flex>
          ))}
        </Flex>
        <Flex align="center" gap="4" className={cn("hidden shrink-0 lg:flex")}>
          <TextLink href={`${publicRoutes.home}#how-it-works`} tone="muted" className={cn("text-xs font-medium")}>
            How it works
          </TextLink>
          <TextLink href={`mailto:${STORE.supportEmail}`} tone="muted" className={cn("text-xs font-medium")}>
            Help
          </TextLink>
        </Flex>
      </Container>
    </Flex>
  );
}
