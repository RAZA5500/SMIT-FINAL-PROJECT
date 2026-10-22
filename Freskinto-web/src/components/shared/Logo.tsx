import { Leaf } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "size-7 rounded-lg [&_svg]:size-4", word: "text-xl" },
  md: { mark: "size-9 rounded-xl [&_svg]:size-5", word: "text-2xl" },
  lg: { mark: "size-11 rounded-2xl [&_svg]:size-6", word: "text-3xl" },
} as const;

type LogoSize = keyof typeof SIZES;

/** Freskinto leaf mark — brand green leaf */
export function LogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  return (
    <Box
      as="span"
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 -rotate-6 items-center justify-center bg-brand-green text-white shadow-xs",
        SIZES[size].mark,
        className,
      )}
    >
      <Leaf strokeWidth={2.4} />
    </Box>
  );
}

interface LogoProps {
  size?: LogoSize;
  /** Sirf mark (collapsed sidebar, chhoti jagah) */
  markOnly?: boolean;
  className?: string;
}

/** Mark + clean modern wordmark */
export function Logo({ size = "md", markOnly = false, className }: LogoProps) {
  return (
    <Flex as="span" inline align="center" gap="2.5" className={cn(className)}>
      <LogoMark size={size} />
      {!markOnly && (
        <Text
          as="span"
          weight="bold"
          className={cn("font-bold leading-none tracking-tight text-foreground font-serif", SIZES[size].word)}
        >
          {STORE.name}
        </Text>
      )}
    </Flex>
  );
}
