import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
        <Label htmlFor={id} className="font-normal text-slate-deep">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-placeholder">
            {leftIcon}
          </span>
        )}
        <Input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 rounded-15 border-gray-200 bg-white text-sm placeholder:text-placeholder",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className,
          )}
          {...props}
        />
        {rightIcon && <span className="absolute right-3 flex items-center text-placeholder">{rightIcon}</span>}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
