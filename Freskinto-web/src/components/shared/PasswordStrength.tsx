import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RULES = [
  { key: "length", label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { key: "case", label: "Upper & lower case letters", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { key: "number", label: "A number", test: (value: string) => /\d/.test(value) },
  { key: "symbol", label: "A symbol (e.g. ! ? #)", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

const LEVELS = [
  { label: "Too short", bar: "bg-destructive" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-warning" },
  { label: "Good", bar: "bg-brand-green-light" },
  { label: "Strong", bar: "bg-brand-green" },
] as const;

/** Live password feedback — sirf dikhawa, asli validation Zod schema karta hai */
export function PasswordStrength({ password, className }: { password: string; className?: string }) {
  if (!password) return null;

  const passed = RULES.filter((rule) => rule.test(password)).length;
  const level = LEVELS[password.length < 8 ? 0 : passed];

  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border border-border bg-muted/50 p-3.5", className)}>
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="flex flex-1 gap-1.5">
          {RULES.map((rule, index) => (
            <span
              key={rule.key}
              className={cn("h-1.5 flex-1 rounded-full bg-border transition-colors", index < passed && level.bar)}
            />
          ))}
        </div>
        <p aria-live="polite" className="w-16 text-right text-fs-12 font-semibold text-foreground">
          {level.label}
        </p>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.key}
              className={cn("flex items-center gap-2 text-fs-12", ok ? "text-success-ink" : "text-muted-foreground")}
            >
              {ok ? <Check aria-hidden="true" className="size-3.5" /> : <Circle aria-hidden="true" className="size-3.5" />}
              <span>{rule.label}</span>
              <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
