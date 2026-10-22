"use client";

import { Search, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  /** Parent `useDebounce(value)` se query banata hai — har key par API call nahi (FLOW-MD 08 §8) */
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Screen ka apna look (e.g. toolbar ka chhota search) */
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
    <InputGroup className={cn("w-full", className)}>
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn("[&::-webkit-search-cancel-button]:hidden", inputClassName)}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => onValueChange("")}>
            <X aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
