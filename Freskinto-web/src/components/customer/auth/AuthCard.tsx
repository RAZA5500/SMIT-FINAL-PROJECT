"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PointerEvent, ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Grid } from "@/components/ui/grid";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const MODES = [
  { label: "Sign in", href: publicRoutes.login },
  { label: "Create account", href: publicRoutes.register },
];

/**
 * Sign in ↔ Create account ka segmented switch. Layout dono pages par wahi rehta hai, isliye
 * safed pill route badalne par ek se doosre khaane mein phisalti hai.
 */
function AuthModeSwitch({ pathname }: { pathname: string }) {
  const activeIndex = MODES.findIndex((mode) => pathname.startsWith(mode.href));
  if (activeIndex === -1) return null;

  return (
    <Grid as="nav" aria-label="Account" className="relative mb-6 grid-cols-2 rounded-full bg-muted/70 p-1">
      <Box
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-soft transition-transform duration-500 ease-spring",
          activeIndex === 1 && "translate-x-full",
        )}
      />
      {MODES.map((mode, index) => (
        <Box
          key={mode.href}
          render={<Link href={mode.href} replace aria-current={index === activeIndex ? "page" : undefined} />}
          className={cn(
            "relative z-10 flex h-9 items-center justify-center rounded-full text-fs-14 font-semibold transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            index === activeIndex ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {mode.label}
        </Box>
      ))}
    </Grid>
  );
}

/** Glass auth card — cursor ke saath border par halki hari chamak (CSS vars, re-render nahi) */
export function AuthCard({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <Box
      onPointerMove={onPointerMove}
      className="group/card glass relative isolate rounded-[2rem] border border-glass-border p-6 shadow-lift sm:p-8"
    >
      {/* Border ki chamak: gradient sirf 1px ring mein dikhta hai (mask), andar ka glass saaf */}
      <Box
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] p-px opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 [background:radial-gradient(18rem_circle_at_var(--mx,50%)_var(--my,0%),rgb(34_211_138/0.7),transparent_70%)] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
      />
      <Box
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 [background:radial-gradient(24rem_circle_at_var(--mx,50%)_var(--my,0%),rgb(34_211_138/0.07),transparent_70%)]"
      />
      <AuthModeSwitch pathname={pathname} />
      {children}
    </Box>
  );
}
