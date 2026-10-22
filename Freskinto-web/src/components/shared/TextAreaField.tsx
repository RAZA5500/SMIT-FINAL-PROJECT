import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldMessage } from "./FieldMessage";

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
      <Textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={className}
        {...props}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
