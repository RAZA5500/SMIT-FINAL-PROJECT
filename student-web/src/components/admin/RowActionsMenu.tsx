"use client";

import { EllipsisVertical, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

/** Admin table row ka "⋮" menu (Freshes solid chip trigger) */
export function RowActionsMenu({ label, actions }: { label: string; actions: RowAction[] }) {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions for ${label}`}
          className="cursor-pointer rounded-5 bg-actions-btn p-1.5 text-white transition-opacity hover:opacity-80"
        >
          <EllipsisVertical className="size-4" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {actions.map(({ label: actionLabel, icon: Icon, onSelect, destructive, disabled }) => (
            <DropdownMenuItem
              key={actionLabel}
              variant={destructive ? "destructive" : "default"}
              disabled={disabled}
              onClick={onSelect}
            >
              {Icon && <Icon aria-hidden="true" />}
              {actionLabel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
