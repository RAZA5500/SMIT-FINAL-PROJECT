import { Leaf } from "lucide-react";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "size-7 rounded-md [&_svg]:size-4", word: "text-base" },
  md: { mark: "size-8 rounded-lg [&_svg]:size-4.5", word: "text-lg" },
  lg: { mark: "size-11 rounded-xl [&_svg]:size-6", word: "text-2xl" },
} as const;

type LogoSize = keyof typeof SIZES;

/** Freskinto mark — a leaf on a plain indigo square */
export function LogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  return (
    <Flex
      as="span"
      inline
      align="center"
      justify="center"
      aria-hidden="true"
      className={cn("shrink-0 bg-primary text-primary-foreground", SIZES[size].mark, className)}
    >
      <Leaf strokeWidth={2.25} />
    </Flex>
  );
}

interface LogoProps {
  size?: LogoSize;
  /** Sirf mark (collapsed sidebar, chhoti jagah) */
  markOnly?: boolean;
  className?: string;
}

/** Mark + wordmark */
export function Logo({ size = "md", markOnly = false, className }: LogoProps) {
  return (
    <Flex as="span" inline align="center" gap="2" className={className}>
      <LogoMark size={size} />
      {!markOnly && (
        <Text as="span" weight="semibold" className={cn("leading-none tracking-tight text-foreground", SIZES[size].word)}>
          {STORE.name}
        </Text>
      )}
    </Flex>
  );
}
