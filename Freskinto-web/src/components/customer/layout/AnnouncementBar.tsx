import { Clock, PackageCheck, Store, Truck } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";

/** Store ke asli wade (FLOW-MD 01: shipping 0, pickup slot, payment window, cancel before packing) */
const MESSAGES = [
  { icon: Truck, text: "Free delivery on every order — no minimum spend" },
  { icon: Store, text: "Click & collect at a time that suits you" },
  { icon: Clock, text: `Confirmed the moment you pay — ${STORE.paymentWindowMinutes}-minute window` },
  { icon: PackageCheck, text: "Cancel any time before we start packing" },
];

function MessageRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <Flex as="ul" align="center" gap="10" aria-hidden={hidden || undefined} className="shrink-0 pr-10">
      {MESSAGES.map(({ icon: Icon, text }) => (
        <Flex as="li" key={text} align="center" gap="2" className="shrink-0">
          <Icon aria-hidden="true" className="size-3.5" />
          <Text as="span" tone="inherit" weight="semibold" className="text-fs-12 whitespace-nowrap">
            {text}
          </Text>
          <Text as="span" tone="inherit" aria-hidden="true" className="pl-8 text-fs-12">
            ✺
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

/** Lime marquee strip — hover par ruk jata hai; reduced-motion users ke liye animation band */
export function AnnouncementBar() {
  return (
    <Box aria-label="Store promises" className="group/ticker mask-fade-x overflow-hidden bg-lime py-2 text-lime-foreground">
      <Flex className="w-max animate-marquee group-hover/ticker:[animation-play-state:paused]">
        <MessageRow />
        <MessageRow hidden />
      </Flex>
    </Box>
  );
}
