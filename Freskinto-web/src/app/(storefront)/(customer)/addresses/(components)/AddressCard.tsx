"use client";

import { EllipsisVertical, Home, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { IAddress } from "@/services/addresses/types";

interface AddressCardProps {
  address: IAddress;
  settingDefault: boolean;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}

/** Address book entry — default ko emerald ring + badge */
export function AddressCard({ address, settingDefault, onEdit, onSetDefault, onDelete }: AddressCardProps) {
  const Icon = address.isDefault ? Home : MapPin;

  return (
    <Card className={cn("h-full", address.isDefault && "ring-2 ring-primary")}>
      <CardHeader>
        <Flex
          align="center"
          justify="center"
          className={cn(
            "size-11 rounded-2xl [&_svg]:size-5",
            address.isDefault ? "bg-primary text-primary-foreground" : "border bg-background text-brand",
          )}
        >
          <Icon aria-hidden="true" />
        </Flex>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${address.addressLine}`} className={cn("text-muted-foreground")} />
              }
            >
              <EllipsisVertical aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn("w-48")}>
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
        </CardAction>
      </CardHeader>
      <CardContent className={cn("flex-1")}>
        <Stack as="address" gap="0.5" className={cn("not-italic")}>
          <Text weight="semibold">{address.addressLine}</Text>
          <Text tone="muted">
            {address.city}, {address.county}
          </Text>
          <Text variant="code" tone="muted" className={cn("text-sm uppercase")}>
            {address.postcode}
          </Text>
        </Stack>
      </CardContent>
      <CardFooter className={cn("justify-between gap-2 border-dashed bg-transparent")}>
        {address.isDefault ? (
          <Badge variant="tag" className={cn("text-brand")}>
            Default address
          </Badge>
        ) : (
          <Button variant="outline" size="sm" disabled={settingDefault} onClick={onSetDefault}>
            <Star data-icon="inline-start" aria-hidden="true" />
            Set as default
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil data-icon="inline-start" aria-hidden="true" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
