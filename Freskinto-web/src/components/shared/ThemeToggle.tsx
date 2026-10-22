"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/** Light ↔ dark — icon ghoom kar badalta hai; choice localStorage mein (agli visit par bhi) */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            onClick={toggleTheme}
            className={cn("relative rounded-full", className)}
          />
        }
      >
        <Sun
          aria-hidden="true"
          className="size-5 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90"
        />
        <Moon
          aria-hidden="true"
          className="absolute size-5 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0"
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
