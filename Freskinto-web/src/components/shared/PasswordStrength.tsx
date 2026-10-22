import { Check, Circle } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
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
  { label: "Good", bar: "bg-tangerine" },
  { label: "Strong", bar: "bg-lime" },
] as const;

/** Live password feedback — sirf dikhawa, asli validation Zod schema karta hai */
export function PasswordStrength({ password, className }: { password: string; className?: string }) {
  if (!password) return null;

  const passed = RULES.filter((rule) => rule.test(password)).length;
  const level = LEVELS[password.length < 8 ? 0 : passed];

  return (
    <Stack gap="3" className={cn("rounded-xl border border-border bg-muted/50 p-3.5", className)}>
      <Flex align="center" gap="3">
        <Flex aria-hidden="true" gap="1.5" className="flex-1">
          {RULES.map((rule, index) => (
            <Box
              as="span"
              key={rule.key}
              className={cn("h-1.5 flex-1 rounded-full bg-border transition-colors", index < passed && level.bar)}
            />
          ))}
        </Flex>
        <Text aria-live="polite" weight="semibold" className="w-16 text-right text-fs-12">
          {level.label}
        </Text>
      </Flex>
      <Grid as="ul" gap="1.5" className="sm:grid-cols-2">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <Flex
              as="li"
              key={rule.key}
              align="center"
              gap="2"
              className={cn("text-fs-12", ok ? "text-success-ink" : "text-muted-foreground")}
            >
              {ok ? <Check aria-hidden="true" className="size-3.5" /> : <Circle aria-hidden="true" className="size-3.5" />}
              <Text as="span" tone="inherit" className="text-fs-12">
                {rule.label}
              </Text>
              <Text as="span" className="sr-only">
                {ok ? "(met)" : "(not met)"}
              </Text>
            </Flex>
          );
        })}
      </Grid>
    </Stack>
  );
}
