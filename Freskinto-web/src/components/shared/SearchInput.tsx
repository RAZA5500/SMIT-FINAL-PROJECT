"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  /** Parent ke paas committed (debounced) value — query key isi se bante hain */
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** Typing rukne ke itne ms baad hi `onValueChange` (har key par API call nahi — FLOW-MD 08 §8) */
  delayMs?: number;
  className?: string;
  "aria-label"?: string;
}

/**
 * Filter bars ka debounced search: user ki typing local `draft` mein rehti hai, parent ko sirf
 * pause ke baad value milti hai. Bahar se value badle (e.g. "Clear filters") to draft sync ho jata hai.
 */
export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search…",
  delayMs = 400,
  className,
  "aria-label": ariaLabel,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  // Wo value jo parent ke paas hone ka humein pata hai (trim parent ki taraf se ho sakta hai)
  const [known, setKnown] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (value.trim() !== known.trim()) {
    setKnown(value);
    setDraft(value);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = (next: string) => {
    setKnown(next);
    onValueChange(next);
  };

  const handleChange = (next: string) => {
    setDraft(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), delayMs);
  };

  const handleClear = () => {
    clearTimeout(timer.current);
    setDraft("");
    commit("");
  };

  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="[&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={handleClear}>
            <X aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
