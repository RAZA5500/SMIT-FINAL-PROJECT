"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useState } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Text } from "@/components/ui/typography";
import { FieldMessage } from "@/components/shared/FieldMessage";
import { cn } from "@/lib/utils";

/** `datetime-local` format (local time, bina seconds) — checkout schema isi ko parse karta hai */
export function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const OPEN_HOUR = 9;
const CLOSE_HOUR = 20;
const DAYS_AHEAD = 6;
/** Order pack karne ka waqt — itne ghante se pehle ka slot nahi */
const LEAD_HOURS = 1;

const dayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: true });

interface Day {
  key: string;
  label: string;
  /** Is din ke available ghante */
  hours: number[];
}

function dayKey(date: Date): string {
  return toDateTimeLocal(date).slice(0, 10);
}

/** Aaj (lead time ke baad) se agle 6 din tak, 9am–8pm ke ghante */
function buildDays(now: Date): Day[] {
  const earliest = now.getHours() + LEAD_HOURS + (now.getMinutes() > 0 ? 1 : 0);
  const days: Day[] = [];
  for (let offset = 0; offset <= DAYS_AHEAD; offset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i).filter(
      (hour) => offset > 0 || hour >= earliest,
    );
    if (hours.length === 0) continue;
    days.push({
      key: dayKey(date),
      label: offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : dayFormatter.format(date),
      hours,
    });
  }
  return days;
}

function hourLabel(hour: number): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return timeFormatter.format(date).replace(" ", "");
}

interface PickupSchedulerProps {
  /** `datetime-local` string ("2026-10-23T14:00") */
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
}

/** Click & collect slot picker — din chuno, phir ghanta (dono ToggleGroup chips) */
export function PickupScheduler({ value, onChange, error }: PickupSchedulerProps) {
  // Mount ke waqt ek dafa — render ke dauran Date.now() nahi
  const [days] = useState(() => buildDays(new Date()));
  const selectedDay = value?.slice(0, 10) ?? days[0]?.key;
  const selectedHour = value ? Number(value.slice(11, 13)) : undefined;
  const day = days.find((item) => item.key === selectedDay) ?? days[0];

  const pick = (dayValue: string, hour: number) => onChange(`${dayValue}T${String(hour).padStart(2, "0")}:00`);

  return (
    <Stack gap="5">
      <Stack gap="2.5">
        <Flex align="center" gap="2">
          <CalendarDays aria-hidden="true" className={cn("size-4 text-brand")} />
          <Text as="span" variant="label">
            Collection day
          </Text>
        </Flex>
        <ToggleGroup
          aria-label="Collection day"
          variant="chip"
          spacing={2}
          value={selectedDay ? [selectedDay] : []}
          onValueChange={(next: string[]) => {
            const nextDay = days.find((item) => item.key === next[0]);
            if (!nextDay) return;
            // Chuna hua ghanta naye din mein bhi ho to wahi rakho, warna pehla khula ghanta
            const hour = selectedHour !== undefined && nextDay.hours.includes(selectedHour) ? selectedHour : nextDay.hours[0];
            pick(nextDay.key, hour);
          }}
          className={cn("flex-wrap")}
        >
          {days.map((item) => (
            <ToggleGroupItem key={item.key} value={item.key}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Stack>

      {day && (
        <Stack gap="2.5">
          <Flex align="center" gap="2">
            <Clock aria-hidden="true" className={cn("size-4 text-brand")} />
            <Text as="span" variant="label">
              Collection time
            </Text>
          </Flex>
          <ToggleGroup
            aria-label="Collection time"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "pickupScheduledAt-error" : undefined}
            variant="chip"
            size="sm"
            spacing={2}
            value={value && selectedDay === day.key && selectedHour !== undefined ? [String(selectedHour)] : []}
            onValueChange={(next: string[]) => {
              if (next[0]) pick(day.key, Number(next[0]));
            }}
            className={cn("flex-wrap")}
          >
            {day.hours.map((hour) => (
              <ToggleGroupItem key={hour} value={String(hour)} className={cn("min-w-16 tabular-nums")}>
                {hourLabel(hour)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Stack>
      )}

      <FieldMessage
        id="pickupScheduledAt"
        error={error}
        hint="We'll have your order packed and waiting at the counter."
      />
    </Stack>
  );
}
