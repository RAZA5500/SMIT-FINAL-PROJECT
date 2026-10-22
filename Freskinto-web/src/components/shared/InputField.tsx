import type { ReactNode } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { describedBy, FieldMessage } from "./FieldMessage";
import { RequiredMark } from "./RequiredMark";

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
  const controlProps = {
    id,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(id, error, hint),
    ...props,
  };

  return (
    <Field data-invalid={error ? true : undefined} className={cn(containerClassName)}>
      {label && (
        <FieldLabel htmlFor={id}>
          {label}
          {required && <RequiredMark />}
        </FieldLabel>
      )}
      {leftIcon || rightIcon ? (
        <InputGroup>
          {leftIcon && <InputGroupAddon>{leftIcon}</InputGroupAddon>}
          <InputGroupInput className={cn(className)} {...controlProps} />
          {rightIcon && <InputGroupAddon align="inline-end">{rightIcon}</InputGroupAddon>}
        </InputGroup>
      ) : (
        <Input className={cn(className)} {...controlProps} />
      )}
      <FieldMessage id={id} error={error} hint={hint} />
    </Field>
  );
}
