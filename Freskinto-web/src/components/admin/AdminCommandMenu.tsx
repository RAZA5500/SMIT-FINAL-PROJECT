"use client";

import { ExternalLink, PackagePlus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Text } from "@/components/ui/typography";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "./admin-nav";

/** ⌘K / Ctrl+K — admin screens aur quick actions tak keyboard se */
export function AdminCommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn("hidden w-64 justify-between rounded-xl px-3 font-normal text-muted-foreground md:inline-flex")}
      >
        <Text as="span" className={cn("flex items-center gap-2")}>
          <Search aria-hidden="true" className={cn("size-4")} />
          Jump to…
        </Text>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Search admin" onClick={() => setOpen(true)} className={cn("md:hidden")}>
        <Search aria-hidden="true" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Jump to" description="Search admin screens and actions">
        <Command>
          <CommandInput placeholder="Search screens and actions…" />
          <CommandList>
            <CommandEmpty>No matching screen.</CommandEmpty>
            <CommandGroup heading="Quick actions">
              <CommandItem onSelect={() => go(adminRoutes.productNew)}>
                <PackagePlus aria-hidden="true" />
                New product
              </CommandItem>
              <CommandItem onSelect={() => go(publicRoutes.home)}>
                <ExternalLink aria-hidden="true" />
                View storefront
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            {ADMIN_NAV.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map(({ label, href, icon: Icon, demo }) => (
                  <CommandItem key={href} value={`${group.label} ${label}`} onSelect={() => go(href)}>
                    <Icon aria-hidden="true" />
                    {label}
                    {demo && (
                      <Badge variant="tag" className={cn("ml-auto")}>
                        Demo
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
