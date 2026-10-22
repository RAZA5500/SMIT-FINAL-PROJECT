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

/** Address book entry — default ko aubergine ring, lime house tile aur sticker badge */
export function AddressCard({ address, settingDefault, onEdit, onSetDefault, onDelete }: AddressCardProps) {
  const Icon = address.isDefault ? Home : MapPin;

  return (
    <Card
      render={<Box as="article" />}
      className={cn(
        "pop-hover h-full gap-3 rounded-3xl border-2 shadow-none has-data-[slot=card-footer]:pb-0",
        address.isDefault && "border-primary",
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-3">
        <Flex
          align="center"
          justify="center"
          aria-hidden="true"
          className={cn(
            "size-12 rounded-2xl [&_svg]:size-5",
            address.isDefault ? "-rotate-6 bg-lime text-lime-foreground" : "bg-plum-soft text-primary",
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
                className="rounded-full text-muted-foreground"
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
          <Text weight="bold" className="text-base">
            {address.addressLine}
          </Text>
          <Text tone="muted">
            {address.city}, {address.county}
          </Text>
          <Text tone="muted" family="mono" className="tracking-wide uppercase">
            {address.postcode}
          </Text>
        </Stack>
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t-2 border-dashed border-input py-3">
        {address.isDefault ? (
          <Badge variant="sticker">Default address</Badge>
        ) : (
          <Button variant="outline" size="sm" className="rounded-full" disabled={settingDefault} onClick={onSetDefault}>
            <Star aria-hidden="true" />
            Set as default
          </Button>
        )}
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onEdit}>
          <Pencil aria-hidden="true" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
