"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useState } from "react";
import { ChipGroup } from "@/components/shared/ChipGroup";
import { FieldMessage } from "@/components/shared/FieldMessage";
import { STORE } from "@/constants/store";

/** `datetime-local` format (local time, bina seconds) — checkout schema isi ko parse karta hai */
export function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const { openHour, closeHour, daysAhead, leadHours } = STORE.pickup;

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
  const earliest = now.getHours() + leadHours + (now.getMinutes() > 0 ? 1 : 0);
  const days: Day[] = [];
  for (let offset = 0; offset <= daysAhead; offset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    const hours = Array.from({ length: closeHour - openHour + 1 }, (_, i) => openHour + i).filter(
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

/** Click & collect slot picker — din chuno, phir ghanta (dono chip groups) */
export function PickupScheduler({ value, onChange, error }: PickupSchedulerProps) {
  // Mount ke waqt ek dafa — render ke dauran Date.now() nahi
  const [days] = useState(() => buildDays(new Date()));
  const selectedDay = value?.slice(0, 10) ?? days[0]?.key;
  const selectedHour = value ? Number(value.slice(11, 13)) : undefined;
  const day = days.find((item) => item.key === selectedDay) ?? days[0];

  const pick = (dayValue: string, hour: number) => onChange(`${dayValue}T${String(hour).padStart(2, "0")}:00`);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <p className="flex items-center gap-2 text-fs-13 font-medium">
          <CalendarDays aria-hidden="true" className="size-4 text-brand-green" />
          Collection day
        </p>
        <ChipGroup<string | null>
          aria-label="Collection day"
          options={days.map((item) => ({ value: item.key, label: item.label }))}
          value={selectedDay ?? null}
          onValueChange={(next) => {
            const nextDay = days.find((item) => item.key === next);
            if (!nextDay) return;
            // Chuna hua ghanta naye din mein bhi ho to wahi rakho, warna pehla khula ghanta
            const hour =
              selectedHour !== undefined && nextDay.hours.includes(selectedHour) ? selectedHour : nextDay.hours[0];
            pick(nextDay.key, hour);
          }}
          className="flex-wrap overflow-visible"
        />
      </div>

      {day && (
        <div className="flex flex-col gap-2.5">
          <p className="flex items-center gap-2 text-fs-13 font-medium">
            <Clock aria-hidden="true" className="size-4 text-brand-green" />
            Collection time
          </p>
          <ChipGroup<string | null>
            aria-label="Collection time"
            size="sm"
            options={day.hours.map((hour) => ({ value: String(hour), label: hourLabel(hour) }))}
            value={value && selectedDay === day.key && selectedHour !== undefined ? String(selectedHour) : null}
            onValueChange={(next) => {
              if (next) pick(day.key, Number(next));
            }}
            className="flex-wrap overflow-visible"
          />
        </div>
      )}

      <FieldMessage
        id="pickupScheduledAt"
        error={error}
        hint="We'll have your order packed and waiting at the counter."
      />
    </div>
  );
}
