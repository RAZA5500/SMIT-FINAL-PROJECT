import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldMessage } from "./FieldMessage";

export interface InputFieldProps extends React.ComponentProps<"input"> {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  /** Interactive ho sakta hai (e.g. password show/hide) */
  rightIcon?: ReactNode;
  containerClassName?: string;
}

/** Label + input + error/hint — `aria-invalid` error par, `htmlFor` = input id (FLOW-MD 07 §10) */
export function InputField({
  id,
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  required,
  className,
  containerClassName,
  ...props
}: InputFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label htmlFor={id} className="text-foreground">
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </span>
        )}
        <Input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(leftIcon && "pl-9.5", rightIcon && "pr-10", className)}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-2 flex items-center text-muted-foreground">{rightIcon}</span>
        )}
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
