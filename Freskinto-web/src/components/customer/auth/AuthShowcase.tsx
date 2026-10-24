"use client";

import { Croissant, Leaf, Milk, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

interface Slide {
  image: string;
  icon: LucideIcon;
  aisle: string;
  title: string;
  text: string;
}

/** Store ke teen hisse — har slide ek asli editorial photo + uska wada */
const SLIDES: Slide[] = [
  {
    image: "/images/editorial/produce-aisle.webp",
    icon: Leaf,
    aisle: "Fruit & veg",
    title: "Fresh produce, straight to your door.",
    text: "Crisp veg and ripe fruit from your neighbourhood market — delivered free on every order.",
  },
  {
    image: "/images/editorial/artisan-bread.webp",
    icon: Croissant,
    aisle: "Bakery",
    title: "Warm bakes, ready when you are.",
    text: "Order online, then pick a click & collect slot that suits you — or let us bring it round.",
  },
  {
    image: "/images/editorial/cheese-board.webp",
    icon: Milk,
    aisle: "Deli & dairy",
    title: "Everyday essentials in one basket.",
    text: "Sign in to save your addresses and follow every order from basket to door.",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Auth page ka right panel: poori photo ka slideshow (crossfade + dheema zoom), neeche headline
 * aur story-style progress bars jo tabs ka kaam karte hain. Hover/focus par slideshow rukta hai,
 * mouse se photo halka khisakti hai. Timer progress bar ki CSS animation hai — `animationend`
 * par agli slide, isliye pause muft mein. Reduced motion par khud nahi badalta.
 */
export function AuthShowcase() {
  const [active, setActive] = useState(0);
  const rafRef = useRef<number | null>(null);
  const slide = SLIDES[active];
  const SlideIcon = slide.icon;

  const next = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive((index) => (index + 1) % SLIDES.length);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const { clientX, clientY } = event;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      element.style.setProperty("--px", (((clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
      element.style.setProperty("--py", (((clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
    });
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <Box
      as="aside"
      aria-label={`Inside ${STORE.name}`}
      aria-roledescription="carousel"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group/show dark sticky top-3 m-3 hidden h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[2.5rem] bg-[#0b1611] text-foreground [--px:0] [--py:0] lg:block"
    >
      {/* Photos — active wali dikhti hai aur dheere zoom-out hoti hai; mouse ke ulta halka khisakti hain */}
      {SLIDES.map((item, index) => (
        <Box
          key={item.image}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Box className="absolute -inset-6 transition-[translate] duration-700 ease-out-expo motion-safe:[translate:calc(var(--px)*-14px)_calc(var(--py)*-14px)]">
            <Image
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              sizes="50vw"
              className={cn("object-cover", index === active && "animate-ken-burns")}
            />
          </Box>
        </Box>
      ))}

      {/* Text padhne layak rahe — neeche gehra, upar halka saaya */}
      <Box aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_16_11/0.94)_0%,rgb(6_16_11/0.6)_38%,transparent_68%)]" />
      <Box aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgb(6_16_11/0.55),transparent)]" />

      <Stack justify="between" className="relative h-full p-8 xl:p-10">
        <Flex align="center" justify="between" gap="4">
          <Flex align="center" gap="2.5" className="glass w-fit rounded-full border border-glass-border py-1.5 pr-4 pl-2.5">
            <Box as="span" className="relative flex size-2.5">
              <Box as="span" className="absolute inline-flex size-full animate-ping-soft rounded-full bg-fresh" />
              <Box as="span" className="relative inline-flex size-2.5 rounded-full bg-fresh" />
            </Box>
            <Text as="span" weight="semibold" className="text-fs-13">
              Open now · free delivery on every order
            </Text>
          </Flex>
          <Text as="span" tone="inherit" numeric className="text-fs-13 font-semibold text-white/70">
            {pad(active + 1)} <Text as="span" tone="inherit" className="text-white/40">/ {pad(SLIDES.length)}</Text>
          </Text>
        </Flex>

        <Stack gap="6">
          <Stack key={active} gap="3" aria-live="polite" className="max-w-lg">
            <Flex align="center" gap="2" className="animate-fade-up">
              <Flex as="span" align="center" justify="center" className="size-7 rounded-full bg-fresh text-[#06100b]">
                <SlideIcon aria-hidden="true" className="size-3.5" />
              </Flex>
              <Text variant="eyebrow" tone="inherit" className="text-white/80">
                {slide.aisle}
              </Text>
            </Flex>
            <Heading as="h2" size="display" className="animate-fade-up text-white [animation-delay:80ms]">
              {slide.title}
            </Heading>
            <Text tone="inherit" className="animate-fade-up text-base leading-relaxed text-white/75 [animation-delay:160ms]">
              {slide.text}
            </Text>
          </Stack>

          {/* Story-style bars = tabs: click se slide chuno, bhari hui bar batati hai agli kab aayegi */}
          <Grid gap="3" className="grid-cols-3">
            {SLIDES.map((item, index) => (
              <Button
                key={item.image}
                type="button"
                variant="ghost"
                aria-label={`Show ${item.aisle}`}
                aria-current={index === active || undefined}
                onClick={() => setActive(index)}
                className="group/bar h-auto flex-col items-stretch gap-2 rounded-lg p-0 py-1 text-left hover:bg-transparent"
              >
                <Box as="span" className="block h-1 w-full overflow-hidden rounded-full bg-white/20 transition-colors group-hover/bar:bg-white/30">
                  <Box
                    as="span"
                    onAnimationEnd={index === active ? next : undefined}
                    className={cn(
                      "block h-full origin-left rounded-full bg-fresh",
                      index < active && "scale-x-100",
                      index > active && "scale-x-0",
                      index === active &&
                        "animate-slide-progress group-hover/show:[animation-play-state:paused] group-focus-within/show:[animation-play-state:paused]",
                    )}
                  />
                </Box>
                <Text
                  as="span"
                  tone="inherit"
                  className={cn(
                    "text-fs-12 font-semibold transition-colors",
                    index === active ? "text-white" : "text-white/50 group-hover/bar:text-white/80",
                  )}
                >
                  {item.aisle}
                </Text>
              </Button>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
}
