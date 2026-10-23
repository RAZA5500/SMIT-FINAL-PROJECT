"use client";

import { Sparkle } from "lucide-react";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Marquee } from "@/components/ui/marquee";
import { AisleBadge } from "@/components/shared/AisleBadge";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAisles } from "../shop/use-aisles";

const FALLBACK = ["Fresh Fruits", "Vegetables", "Dairy & Eggs", "Cheese", "Bakery", "Meat", "Poultry", "Frozen", "Snacks"];
const PROMISES = ["Free delivery on every order", "Click & collect", "Fresh every morning", "Track every step"];

function RibbonItem({ label, href, inverse }: { label: string; href?: string; inverse?: boolean }) {
  const content = (
    <Flex
      as="span"
      align="center"
      gap="3"
      className={cn(
        "font-display text-xl font-semibold tracking-[-0.03em] whitespace-nowrap sm:text-3xl",
        inverse ? "text-white" : "text-[#06100b]",
      )}
    >
      {href && <AisleBadge name={label} size="md" className="bg-white/70 ring-1 ring-white/60" />}
      {label}
      <Sparkle aria-hidden="true" className={cn("size-5 shrink-0", inverse ? "text-brand" : "text-[#06100b]/60")} />
    </Flex>
  );
  return href ? (
    <Box render={<Link href={href} />} className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-white/50">
      {content}
    </Box>
  ) : (
    content
  );
}

/**
 * Do tirchhe ribbons ek doosre ko kaatte hue — upar aisles (gradient), neeche store ke wade (ink),
 * ulti dishaon mein chalte hain. Page ki poori chaurai mein.
 */
export function HomeRibbons() {
  const { aisles } = useAisles();
  const items = aisles.length ? aisles.map((aisle) => ({ label: aisle.name, href: shopUrl({ category: aisle.id }) })) : FALLBACK.map((label) => ({ label, href: undefined }));

  return (
    <Box className="relative h-44 overflow-x-clip sm:h-56">
      <Box className="absolute inset-x-[-4%] top-[52%] -translate-y-1/2 rotate-[2.5deg] bg-primary py-3 shadow-lift sm:py-4 dark:bg-[#0d1411]">
        <Marquee reverse duration="38s" trackClassName="gap-10 pr-10">
          {PROMISES.map((label) => (
            <RibbonItem key={label} label={label} inverse />
          ))}
        </Marquee>
      </Box>
      <Box className="absolute inset-x-[-4%] top-[42%] -translate-y-1/2 -rotate-[2.5deg] bg-fresh py-3 shadow-glow sm:py-4">
        <Marquee duration="46s" trackClassName="gap-10 pr-10">
          {items.map((item) => (
            <RibbonItem key={item.label} label={item.label} href={item.href} />
          ))}
        </Marquee>
      </Box>
    </Box>
  );
}
