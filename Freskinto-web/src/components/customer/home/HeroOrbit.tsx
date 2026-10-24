"use client";

import { Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { Box } from "@/components/ui/box";
import { CircularText } from "@/components/ui/circular-text";
import { Text } from "@/components/ui/typography";
import { productVisual } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Orbit mein ghoomne wale asli shop products (naam se photo + glow; click = shop search) */
const ORBIT_PRODUCTS = [
  "Royal Gala Apples",
  "Premium Bananas",
  "Fresh Bell Peppers",
  "Mature Cheddar Cheese",
  "Whole Wheat Bread Loaf",
  "Fresh Whole Milk 1L",
  "Premium Sirloin Steak",
  "Organic Baby Spinach",
];

const DURATION = "48s";

/**
 * Sizes `cqi` mein (parent `@container` ki chaurai) — orbit har screen par column mein fit rehta hai.
 * Hero ka "product solar system": beech mein chamakta orb, uske gird asli products ek jhuke hue 3D
 * ring mein ghoomte hain — aage wale bade aur saaf, peeche wale chhote aur dhundle. Mouse se
 * poora scene halka jhukta hai; hover/focus par ruk jata hai.
 */
export function HeroOrbit({ className }: { className?: string }) {
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const cleanupListenerRef = useRef<(() => void) | null>(null);

  const attachListener = () => {
    if (!cleanupListenerRef.current && typeof window !== "undefined") {
      const onScroll = () => {
        rectRef.current = null;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      cleanupListenerRef.current = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }
  };

  const detachListener = () => {
    if (cleanupListenerRef.current) {
      cleanupListenerRef.current();
      cleanupListenerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      detachListener();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    attachListener();
    rectRef.current = event.currentTarget.getBoundingClientRect();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (!rectRef.current) {
      attachListener();
      rectRef.current = event.currentTarget.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const element = event.currentTarget;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      element.style.setProperty("--px", (((clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
      element.style.setProperty("--py", (((clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
    });
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    detachListener();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <Box
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "orbit-stage relative aspect-square w-full [--orb:28cqi] [--orbit-item:19.5cqi] [--orbit-radius:37cqi] [--orbit-tilt:64deg]",
        className,
      )}
    >
      {/* Ring ka raasta aur uski roshni — alag flat layer, plane mein lete hue (ellipse), orb ke peeche */}
      <Box aria-hidden="true" className="orbit-parallax">
        <Box className="orbit-plane">
          <Box className="absolute size-[calc(var(--orbit-radius)*2.3)] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.32),rgb(42_168_242/0.12)_55%,transparent)]" />
          <Box className="absolute size-[calc(var(--orbit-radius)*2)] -translate-1/2 rounded-full border border-dashed border-foreground/15" />
        </Box>
      </Box>

      <Box className="orbit-parallax">
        <Box className="orbit-plane">
          <Box data-orbit-anim="" className="orbit-ring animate-orbit" style={{ animationDuration: DURATION }}>
            {ORBIT_PRODUCTS.map((name, index) => {
              const visual = productVisual(name);
              const angle = (360 / ORBIT_PRODUCTS.length) * index;
              return (
                <Box key={name} className="orbit-slot" style={{ "--angle": `${angle}deg` } as CSSProperties}>
                  <Box data-orbit-anim="" className="orbit-counter animate-orbit-counter" style={{ animationDuration: DURATION }}>
                    <Box className="orbit-upright">
                      <Box
                        data-orbit-anim=""
                        className="orbit-body animate-orbit-depth"
                        style={
                          {
                            "--aura": visual.aura,
                            animationDuration: DURATION,
                            animationDelay: `calc(${DURATION} * ${-angle / 360})`,
                          } as CSSProperties
                        }
                      >
                        <Box
                          render={<Link href={shopUrl({ q: name })} aria-label={`Find ${name}`} />}
                          className="group/orbit relative block size-full rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
                        >
                          <Box aria-hidden="true" className="aura absolute -inset-[30%] rounded-full" />
                          {visual.image && (
                            <Image
                              src={visual.image}
                              alt=""
                              fill
                              priority={index < 4}
                              sizes="128px"
                              className="product-float object-contain transition-transform duration-500 ease-spring group-hover/orbit:scale-125 group-hover/orbit:-rotate-6"
                            />
                          )}
                          <Text
                            as="span"
                            tone="inherit"
                            className="glass pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 scale-90 rounded-full px-2.5 py-1 text-fs-11 font-bold whitespace-nowrap opacity-0 transition-all duration-300 group-hover/orbit:scale-100 group-hover/orbit:opacity-100"
                          >
                            {name}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Beech ka orb — kamre ki taraf seedha khada */}
          <Box className="orbit-upright absolute top-0 left-0">
            <Box className="relative size-(--orb) -translate-1/2">
              <CircularText
                text="Fresh daily · Free delivery · Click & collect · "
                className="absolute -inset-[34%] size-[168%] animate-spin-slow text-foreground/45"
              />
              <Box
                aria-hidden="true"
                className="absolute inset-0 animate-float-slow rounded-full bg-[radial-gradient(circle_at_32%_26%,#ffffff_0%,#dcfff0_14%,#55e0a8_42%,#14b8a6_68%,#0b74b8_100%)] shadow-[0_40px_80px_-24px_rgb(20_192_176/0.75),inset_-18px_-26px_50px_rgb(6_16_11/0.28),inset_10px_12px_30px_rgb(255_255_255/0.5)]"
              >
                <Box className="absolute inset-0 grid place-items-center text-[#06100b]/80">
                  <Leaf className="size-[38%]" strokeWidth={2} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
