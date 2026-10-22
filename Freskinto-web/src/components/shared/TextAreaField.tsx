import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { describedBy, FieldMessage } from "./FieldMessage";
import { RequiredMark } from "./RequiredMark";

export interface TextAreaFieldProps extends React.ComponentProps<"textarea"> {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  required,
  className,
  containerClassName,
  ...props
}: TextAreaFieldProps) {
  return (
    <Field data-invalid={error ? true : undefined} className={cn(containerClassName)}>
      {label && (
        <FieldLabel htmlFor={id}>
          {label}
          {required && <RequiredMark />}
        </FieldLabel>
      )}
      <Textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(className)}
        {...props}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </Field>
  );
}
