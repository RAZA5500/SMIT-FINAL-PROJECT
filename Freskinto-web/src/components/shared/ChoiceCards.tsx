"use client";

import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface ChoiceOption<T extends string = string> {
  value: T;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Right side (e.g. "Free" badge, Default badge) */
  aside?: ReactNode;
  disabled?: boolean;
}

interface ChoiceCardsProps<T extends string> {
  /** Har option ke radio ka id prefix */
  id: string;
  options: ChoiceOption<T>[];
  value: T | "" | undefined;
  onValueChange: (value: T) => void;
  "aria-label": string;
  invalid?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
}

/**
 * Radio group as big tappable cards. Checked card gets a green border, a faint mint wash and a
 * gradient icon chip — selection ek nazar mein samajh aati hai.
 */
export function ChoiceCards<T extends string>({
  id,
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  invalid,
  "aria-describedby": ariaDescribedBy,
  disabled,
  className,
  optionClassName,
}: ChoiceCardsProps<T>) {
  return (
    <RadioGroup
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      aria-describedby={ariaDescribedBy}
      value={value ?? ""}
      onValueChange={(next) => onValueChange(next as T)}
      disabled={disabled}
      className={cn("grid gap-3 sm:grid-cols-2", className)}
    >
      {options.map((option) => {
        const optionId = `${id}-${option.value}`;
        return (
          <Label
            key={option.value}
            htmlFor={optionId}
            className={cn(
              "group/choice flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 font-normal transition-[background-color,border-color,box-shadow] duration-300 hover:bg-muted/40 has-data-checked:border-brand/50 has-data-checked:bg-brand-soft/60 has-data-checked:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_14%,transparent)] has-disabled:cursor-not-allowed has-disabled:opacity-60 dark:has-data-checked:bg-brand/10",
              optionClassName,
            )}
          >
            {option.icon && (
              <Flex
                as="span"
                aria-hidden="true"
                align="center"
                justify="center"
                className="size-10 shrink-0 rounded-full bg-muted text-muted-foreground transition-colors group-has-data-checked/choice:bg-fresh group-has-data-checked/choice:text-[#06100b] [&_svg]:size-4"
              >
                {option.icon}
              </Flex>
            )}
            <Flex as="span" direction="col" gap="0.5" className="min-w-0 flex-1">
              <Text as="span" weight="semibold">
                {option.title}
              </Text>
              {option.description && (
                <Text as="span" tone="muted" className="text-fs-13">
                  {option.description}
                </Text>
              )}
            </Flex>
            {option.aside}
            <Box as="span" className="shrink-0">
              <RadioGroupItem value={option.value} id={optionId} disabled={option.disabled} />
            </Box>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
