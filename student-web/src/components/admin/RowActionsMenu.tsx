"use client";

import { EllipsisVertical, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface RowAction {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

/** Admin table row ka "⋮" menu — destructive actions alag separator ke baad */
export function RowActionsMenu({ label, actions }: { label: string; actions: RowAction[] }) {
  const safe = actions.filter((action) => !action.destructive);
  const destructive = actions.filter((action) => action.destructive);

  const renderItem = ({ label: actionLabel, icon: Icon, onSelect, destructive: isDestructive, disabled }: RowAction) => (
    <DropdownMenuItem
      key={actionLabel}
      variant={isDestructive ? "destructive" : "default"}
      disabled={disabled}
      onClick={onSelect}
    >
      {Icon && <Icon aria-hidden="true" />}
      {actionLabel}
    </DropdownMenuItem>
  );

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions for ${label}`}
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
        >
          <EllipsisVertical aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {safe.map(renderItem)}
          {safe.length > 0 && destructive.length > 0 && <DropdownMenuSeparator />}
          {destructive.map(renderItem)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
