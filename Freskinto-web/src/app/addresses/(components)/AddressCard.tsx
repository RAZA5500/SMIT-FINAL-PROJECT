"use client";

import { EllipsisVertical, Home, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IAddress } from "@/services/addresses/types";

interface AddressCardProps {
  address: IAddress;
  settingDefault: boolean;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}

/** Address book entry — default ko forest ring + badge */
export function AddressCard({ address, settingDefault, onEdit, onSetDefault, onDelete }: AddressCardProps) {
  const Icon = address.isDefault ? Home : MapPin;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-15 border bg-card shadow-soft transition-shadow hover:shadow-lift",
        address.isDefault ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl [&_svg]:size-5",
            address.isDefault ? "bg-brand-green-forest text-white" : "bg-brand-soft text-brand-green",
          )}
        >
          <Icon />
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${address.addressLine}`}
                className="text-muted-foreground"
              />
            }
          >
            <EllipsisVertical aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            {!address.isDefault && (
              <DropdownMenuItem disabled={settingDefault} onClick={onSetDefault}>
                <Star aria-hidden="true" />
                Set as default
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <address className="flex flex-1 flex-col gap-0.5 px-5 pb-5 not-italic">
        <p className="font-semibold text-foreground">{address.addressLine}</p>
        <p className="text-muted-foreground">
          {address.city}, {address.county}
        </p>
        <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">{address.postcode}</p>
      </address>

      <div className="flex items-center justify-between gap-2 border-t border-dashed border-input px-5 py-3">
        {address.isDefault ? (
          <Badge variant="brand">Default address</Badge>
        ) : (
          <Button variant="outline" size="sm" disabled={settingDefault} onClick={onSetDefault}>
            <Star aria-hidden="true" />
            Set as default
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil aria-hidden="true" />
          Edit
        </Button>
      </div>
    </article>
  );
}
