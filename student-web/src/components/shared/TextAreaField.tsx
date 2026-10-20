import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
        <Label htmlFor={id} className="font-normal text-slate-deep">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn("min-h-24 rounded-15 border-gray-200 bg-white text-sm placeholder:text-placeholder", className)}
        {...props}
      />
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
