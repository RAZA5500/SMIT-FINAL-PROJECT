"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  /** Parent `useDebounce(value)` se query banata hai — har key par API call nahi (FLOW-MD 08 §8) */
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Screen ka apna look (e.g. shop ka bara gray search box) */
  inputClassName?: string;
  "aria-label"?: string;
}

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  inputClassName,
  "aria-label": ariaLabel,
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn(
          "h-11 rounded-15 border-gray-200 bg-white pl-9 text-sm placeholder:text-gray-400",
          inputClassName,
        )}
      />
    </div>
  );
}
