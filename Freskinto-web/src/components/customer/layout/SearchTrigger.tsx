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
      <Button variant="ghost" size="icon" aria-label="Search products" onClick={onOpen} className={cn("rounded-full", className)}>
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
        "h-11 w-full justify-start gap-3 rounded-full border-2 border-border bg-muted/60 pr-2 pl-4 font-normal text-muted-foreground shadow-none hover:border-primary hover:bg-card",
        className,
      )}
    >
      <Search aria-hidden="true" className="size-4 text-primary" />
      <Text as="span" tone="inherit" className="flex-1 truncate text-left">
        Search apples, milk, chicken…
      </Text>
      <Flex as="span" align="center" gap="1" aria-hidden="true" className="hidden lg:flex">
        <Kbd className="bg-card">⌘</Kbd>
        <Kbd className="bg-card">K</Kbd>
      </Flex>
    </Button>
  );
}
