"use client";

import { ExternalLink, Moon, PackagePlus, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ADMIN_NAV } from "@/constants/navigation";
import { useTheme } from "@/hooks/useTheme";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";

interface AdminCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Admin ⌘K palette — har section, "new product", storefront aur theme ek keyboard jump door */
export function AdminCommandPalette({ open, onOpenChange }: AdminCommandPaletteProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Admin command palette" description="Jump to a section or run an action">
      <Command loop className="rounded-none! p-0">
        <CommandInput placeholder="Jump to… orders, products, inventory" aria-label="Search admin sections" />
        <CommandList className="px-2 pb-2">
          <CommandEmpty>No matching section.</CommandEmpty>
          {ADMIN_NAV.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map(({ label, href, icon: Icon }) => (
                <CommandItem key={href} value={label} onSelect={() => go(href)}>
                  <Icon aria-hidden="true" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator className="my-1" />
          <CommandGroup heading="Actions">
            <CommandItem value="New product" onSelect={() => go(adminRoutes.productNew)}>
              <PackagePlus aria-hidden="true" />
              New product
              <CommandShortcut>N</CommandShortcut>
            </CommandItem>
            <CommandItem value="View storefront" onSelect={() => go(publicRoutes.shop)}>
              <ExternalLink aria-hidden="true" />
              View storefront
            </CommandItem>
            <CommandItem value="Toggle theme dark light" onSelect={() => toggleTheme()}>
              {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
