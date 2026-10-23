"use client";

import type { PointerEvent } from "react";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const WORD =
  "col-start-1 row-start-1 font-display text-[clamp(3.5rem,17vw,16rem)] leading-[0.82] font-bold tracking-[-0.07em] whitespace-nowrap lowercase select-none";

/** Footer ka bara wordmark — jahan cursor ho wahan gradient roshni (CSS mask, re-render nahi) */
export function FooterWordmark() {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <Grid
      aria-hidden="true"
      onPointerMove={onPointerMove}
      className="group/word -mb-[0.12em] justify-center overflow-hidden [--mx:30%] [--my:60%]"
    >
      <Text as="span" tone="inherit" className={cn(WORD, "text-white/[0.07]")}>
        {STORE.name}
      </Text>
      <Text
        as="span"
        tone="inherit"
        className={cn(
          WORD,
          "text-fresh opacity-70 transition-opacity duration-500 [mask-image:radial-gradient(18rem_circle_at_var(--mx)_var(--my),#000_0%,transparent_70%)] group-hover/word:opacity-100",
        )}
      >
        {STORE.name}
      </Text>
    </Grid>
  );
}
