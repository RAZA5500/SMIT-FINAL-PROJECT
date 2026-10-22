import { Citrus } from "lucide-react";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "size-8 rounded-lg [&_svg]:size-4", word: "text-xl" },
  md: { mark: "size-10 rounded-xl [&_svg]:size-5", word: "text-2xl" },
  lg: { mark: "size-14 rounded-2xl [&_svg]:size-7", word: "text-4xl" },
} as const;

type LogoSize = keyof typeof SIZES;

/** Freskinto mark — tilted lime tile with a citrus slice, ink edge (sticker look) */
export function LogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  return (
    <Flex
      as="span"
      inline
      align="center"
      justify="center"
      aria-hidden="true"
      className={cn(
        "shrink-0 -rotate-6 border-2 border-pop bg-lime text-lime-foreground shadow-pop-sm transition-transform group-hover/logo:rotate-6",
        SIZES[size].mark,
        className,
      )}
    >
      <Citrus strokeWidth={2.4} />
    </Flex>
  );
}

interface LogoProps {
  size?: LogoSize;
  /** Sirf mark (collapsed sidebar, chhoti jagah) */
  markOnly?: boolean;
  /** Night (dark) background par wordmark roshan */
  inverse?: boolean;
  className?: string;
}

/** Mark + chunky Bricolage wordmark with a tangerine dot */
export function Logo({ size = "md", markOnly = false, inverse = false, className }: LogoProps) {
  return (
    <Flex as="span" inline align="center" gap="2.5" className={cn("group/logo", className)}>
      <LogoMark size={size} />
      {!markOnly && (
        <Text
          as="span"
          family="heading"
          weight="extrabold"
          className={cn(
            "leading-none tracking-tighter",
            inverse ? "text-night-foreground" : "text-foreground",
            SIZES[size].word,
          )}
        >
          {STORE.name.toLowerCase()}
          <Text as="span" tone="inherit" aria-hidden="true" className="text-tangerine">
            .
          </Text>
        </Text>
      )}
    </Flex>
  );
}
