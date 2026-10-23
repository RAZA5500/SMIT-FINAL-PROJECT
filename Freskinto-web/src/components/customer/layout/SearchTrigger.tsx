"use client";

import { Search } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Kbd } from "@/components/ui/kbd";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  onOpen: () => void;
  /** `bar`: input jaisa (desktop) · `icon`: sirf icon (phone) */
  variant?: "bar" | "icon";
  className?: string;
}

/** ⌘K / Ctrl+K (aur "/") se search palette khulta hai — typing fields mein "/" ignore */
export function useSearchHotkey(onOpen: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpen]);
}

/** Header ka search — asal mein ek button jo command palette kholta hai */
export function SearchTrigger({ onOpen, variant = "bar", className }: SearchTriggerProps) {
  if (variant === "icon") {
    return (
      <Button variant="ghost" size="icon" aria-label="Search products" onClick={onOpen} className={className}>
        <Search aria-hidden="true" className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={onOpen}
      aria-label="Search products"
      className={cn(
        "h-11 w-52 justify-start gap-2.5 border-transparent bg-foreground/[0.05] pr-2 pl-4 font-medium text-muted-foreground shadow-none hover:translate-y-0 hover:border-border hover:bg-card hover:text-foreground xl:w-64 dark:bg-foreground/[0.07]",
        className,
      )}
    >
      <Search aria-hidden="true" />
      <Text as="span" tone="inherit" className="flex-1 truncate text-left">
        Search products…
      </Text>
      <Flex as="span" align="center" gap="1" aria-hidden="true" className="hidden xl:flex">
        <Kbd className="border bg-card">⌘</Kbd>
        <Kbd className="border bg-card">K</Kbd>
      </Flex>
    </Button>
  );
}
