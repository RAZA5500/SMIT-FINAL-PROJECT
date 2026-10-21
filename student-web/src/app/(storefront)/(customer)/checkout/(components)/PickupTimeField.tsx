"use client";

import { CalendarClock } from "lucide-react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { InputField } from "@/components/shared/InputField";
import { cn } from "@/lib/utils";

/** `<input type="datetime-local">` format (local time, bina seconds) */
export function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });

/** Agle chaar munasib slots: aaj (kam az kam 2 ghante baad, 8pm tak) phir kal subah/dopahar */
function quickSlots(now: Date): { value: string; label: string }[] {
  const slots: Date[] = [];
  const first = new Date(now);
  first.setMinutes(0, 0, 0);
  first.setHours(first.getHours() + 2);
  for (const offset of [0, 2]) {
    const slot = new Date(first);
    slot.setHours(first.getHours() + offset);
    if (slot.getDate() === now.getDate() && slot.getHours() <= 20) slots.push(slot);
  }
  for (const hour of [10, 13, 17]) {
    const slot = new Date(now);
    slot.setDate(now.getDate() + 1);
    slot.setHours(hour, 0, 0, 0);
    slots.push(slot);
  }
  return slots.slice(0, 4).map((slot) => ({
    value: toDateTimeLocal(slot),
    label: `${slot.getDate() === now.getDate() ? "Today" : "Tomorrow"}, ${timeFormatter.format(slot)}`,
  }));
}

interface PickupTimeFieldProps {
  registration: UseFormRegisterReturn<"pickupScheduledAt">;
  value: string | undefined;
  onPick: (value: string) => void;
  error?: string;
}

export function PickupTimeField({ registration, value, onPick, error }: PickupTimeFieldProps) {
  // Mount ke waqt ek dafa — render ke dauran Date.now() nahi
  const [{ min, slots }] = useState(() => {
    const now = new Date();
    return { min: toDateTimeLocal(now), slots: quickSlots(now) };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Quick picks</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested collection times">
          {slots.map((slot) => {
            const active = slot.value === value;
            return (
              <button
                key={slot.value}
                type="button"
                aria-pressed={active}
                onClick={() => onPick(slot.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors",
                  active ? "bg-primary text-primary-foreground ring-primary" : "bg-card ring-border hover:ring-foreground/30",
                )}
              >
                <CalendarClock className="size-4" aria-hidden="true" />
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>
      <InputField
        id="pickupScheduledAt"
        type="datetime-local"
        label="Or choose your own time"
        required
        min={min}
        containerClassName="sm:max-w-xs"
        error={error}
        {...registration}
      />
    </div>
  );
}
