import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const RULES = [
  { key: "length", label: "At least 8 characters", hint: "8+ characters", test: (value: string) => value.length >= 8 },
  {
    key: "case",
    label: "Upper & lower case letters",
    hint: "upper & lower case",
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { key: "number", label: "A number", hint: "a number", test: (value: string) => /\d/.test(value) },
  { key: "symbol", label: "A symbol (e.g. ! ? #)", hint: "a symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

const LEVELS = [
  { label: "Too short", bar: "bg-destructive" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-warning" },
  { label: "Good", bar: "bg-primary" },
  { label: "Strong", bar: "bg-success" },
] as const;

/**
 * Live password feedback ek hi line mein — bars + level + agla kya chahiye. Auth card bina scroll ke
 * screen mein rahe. Poori checklist screen readers ke liye `sr-only` list mein. Sirf dikhawa, asli
 * validation Zod schema karta hai.
 */
export function PasswordStrength({ password, className }: { password: string; className?: string }) {
  if (!password) return null;

  const passed = RULES.filter((rule) => rule.test(password)).length;
  const level = LEVELS[password.length < 8 ? 0 : passed];
  const missing = RULES.filter((rule) => !rule.test(password));

  return (
    <Flex align="center" gap="3" className={cn("min-h-4", className)}>
      <Flex aria-hidden="true" gap="1" className="w-24 shrink-0">
        {RULES.map((rule, index) => (
          <Box
            as="span"
            key={rule.key}
            className={cn("h-1 flex-1 rounded-full bg-border transition-colors duration-300", index < passed && level.bar)}
          />
        ))}
      </Flex>
      <Text aria-live="polite" className="min-w-0 truncate text-fs-12">
        <Text as="span" weight="semibold">
          {level.label}
        </Text>
        {missing.length > 0 && (
          <Text as="span" tone="muted" aria-hidden="true">
            {" "}
            · add {missing.map((rule) => rule.hint).join(", ")}
          </Text>
        )}
      </Text>
      <Box as="ul" className="sr-only">
        {RULES.map((rule) => (
          <Box as="li" key={rule.key}>
            {rule.label} {rule.test(password) ? "(met)" : "(not met)"}
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
