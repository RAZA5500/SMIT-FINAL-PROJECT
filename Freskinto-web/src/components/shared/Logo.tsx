import { Leaf } from "lucide-react";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "size-8 rounded-xl [&_svg]:size-4", word: "text-base" },
  md: { mark: "size-10 rounded-2xl [&_svg]:size-5", word: "text-xl" },
  lg: { mark: "size-12 rounded-2xl [&_svg]:size-6", word: "text-2xl" },
} as const;

type LogoSize = keyof typeof SIZES;

/** Freskinto mark — a leaf on the fresh gradient; spins a little when the logo is hovered */
export function LogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  return (
    <Flex
      as="span"
      inline
      align="center"
      justify="center"
      aria-hidden="true"
      className={cn(
        "shrink-0 bg-fresh text-[#06100b] shadow-glow transition-transform duration-500 ease-spring group-hover/logo:scale-110 group-hover/logo:-rotate-12",
        SIZES[size].mark,
        className,
      )}
    >
      <Leaf strokeWidth={2.4} />
    </Flex>
  );
}

interface LogoProps {
  size?: LogoSize;
  /** Sirf mark (collapsed sidebar, chhoti jagah) */
  markOnly?: boolean;
  className?: string;
}

/** Mark + lowercase Unbounded wordmark */
export function Logo({ size = "md", markOnly = false, className }: LogoProps) {
  return (
    <Flex as="span" inline align="center" gap="2.5" className={cn("group/logo", className)}>
      <LogoMark size={size} />
      {!markOnly && (
        <Text
          as="span"
          weight="semibold"
          className={cn("font-display leading-none tracking-[-0.05em] text-foreground lowercase", SIZES[size].word)}
        >
          {STORE.name}
        </Text>
      )}
    </Flex>
  );
}
