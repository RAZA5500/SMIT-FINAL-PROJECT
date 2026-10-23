"use client";

import { EllipsisVertical, Home, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

/** Address book entry — default address gets a green border, a gradient icon chip and a "Default" badge */
export function AddressCard({ address, settingDefault, onEdit, onSetDefault, onDelete }: AddressCardProps) {
  const Icon = address.isDefault ? Home : MapPin;

  return (
    <Card
      render={<Box as="article" />}
      className={cn(
        "h-full gap-3 transition-colors hover:border-foreground/15 has-data-[slot=card-footer]:pb-0",
        address.isDefault && "border-brand/50 hover:border-brand/50",
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-3">
        <Flex
          align="center"
          justify="center"
          aria-hidden="true"
          className={cn(
            "size-9 rounded-md [&_svg]:size-4",
            address.isDefault ? "bg-fresh text-[#06100b]" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon />
        </Flex>
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
      </CardHeader>

      <CardContent className="flex-1">
        <Stack as="address" gap="0.5" className="not-italic">
          <Text weight="medium" className="text-base">
            {address.addressLine}
          </Text>
          <Text tone="muted">
            {address.city}, {address.county}
          </Text>
          <Text tone="muted" className="uppercase">
            {address.postcode}
          </Text>
        </Stack>
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t py-3">
        {address.isDefault ? (
          <Badge variant="brand">Default</Badge>
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
      </CardFooter>
    </Card>
  );
}
