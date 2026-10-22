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
 * Radio group as big tappable cards. Checked card gets an aubergine ring and a lilac wash, aur
 * icon tile lime ho jati hai — selection ek nazar mein samajh aati hai.
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
              "group/choice flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 font-normal transition-all hover:border-foreground/30 has-data-checked:border-primary has-data-checked:bg-plum-soft has-disabled:cursor-not-allowed has-disabled:opacity-60",
              optionClassName,
            )}
          >
            {option.icon && (
              <Flex
                as="span"
                aria-hidden="true"
                align="center"
                justify="center"
                className="size-11 shrink-0 rounded-xl bg-muted text-primary transition-colors group-has-data-checked/choice:bg-lime group-has-data-checked/choice:text-lime-foreground [&_svg]:size-5"
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
