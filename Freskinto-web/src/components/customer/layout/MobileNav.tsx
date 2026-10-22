"use client";

import { ChevronRight, House, LayoutGrid, LogOut, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/flex";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Text } from "@/components/ui/typography";
import { aisleNumber } from "@/components/shared/AisleTag";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { useLogout } from "@/hooks/useLogout";
import { categoryTheme } from "@/lib/merchandising";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";
import { useAisles } from "../shop/use-aisles";
import { accountLinks } from "./account-links";

/** Phone navigation drawer — aisles + account */
export function MobileNav() {
  const open = useUiStore((state) => state.menuOpen);
  const setOpen = useUiStore((state) => state.setMenuOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className={cn("w-full max-w-xs gap-0 p-0")}>
        <MobileNavBody onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function NavRow({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Item size="sm" render={<Link href={href} onClick={onNavigate} />} className={cn("rounded-xl")}>
      <ItemMedia className={cn("size-9 rounded-lg border bg-background text-brand [&_svg]:size-4")}>{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle className={cn("font-medium")}>{label}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ChevronRight aria-hidden="true" className={cn("size-4 text-muted-foreground")} />
      </ItemActions>
    </Item>
  );
}

function MobileNavBody({ onNavigate }: { onNavigate: () => void }) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const { aisles } = useAisles();
  const signedIn = token ? user : null;

  return (
    <>
      <SheetHeader className={cn("border-b px-5 py-4")}>
        <SheetTitle render={<Link href={publicRoutes.home} onClick={onNavigate} />}>
          <Logo size="sm" />
        </SheetTitle>
        <SheetDescription className={cn("sr-only")}>Browse aisles and your account</SheetDescription>
      </SheetHeader>

      <ScrollArea className={cn("min-h-0 flex-1")}>
        <Stack as="nav" aria-label="Mobile" gap="4" className={cn("px-3 py-4")}>
          <ItemGroup className={cn("gap-1")}>
            <NavRow href={publicRoutes.home} icon={<House aria-hidden="true" />} label="Home" onNavigate={onNavigate} />
            <NavRow href={shopUrl()} icon={<LayoutGrid aria-hidden="true" />} label="All products" onNavigate={onNavigate} />
          </ItemGroup>

          {aisles.length > 0 && (
            <Stack gap="2">
              <Text variant="eyebrow" className={cn("px-3")}>
                Aisles
              </Text>
              <ItemGroup className={cn("gap-1")}>
                {aisles.map((aisle, index) => {
                  const Icon = categoryTheme(aisle.name).icon;
                  return (
                    <NavRow
                      key={aisle.id}
                      href={shopUrl({ category: aisle.id })}
                      icon={<Icon aria-hidden="true" />}
                      label={
                        <>
                          <Text as="span" variant="code" tone="muted">
                            {aisleNumber(index)}
                          </Text>
                          {aisle.name}
                        </>
                      }
                      onNavigate={onNavigate}
                    />
                  );
                })}
              </ItemGroup>
            </Stack>
          )}

          {signedIn && (
            <Stack gap="2">
              <Text variant="eyebrow" className={cn("px-3")}>
                Your account
              </Text>
              <ItemGroup className={cn("gap-1")}>
                {accountLinks(signedIn).map(({ label, href, icon: Icon }) => (
                  <NavRow key={href} href={href} icon={<Icon aria-hidden="true" />} label={label} onNavigate={onNavigate} />
                ))}
              </ItemGroup>
            </Stack>
          )}
        </Stack>
      </ScrollArea>

      <SheetFooter className={cn("border-t px-5 py-4")}>
        {signedIn ? (
          <Button
            variant="destructive"
            className={cn("w-full")}
            onClick={() => {
              onNavigate();
              logout();
            }}
          >
            <LogOut data-icon="inline-start" aria-hidden="true" />
            Sign out
          </Button>
        ) : (
          <Box className={cn("grid gap-2")}>
            <ButtonLink href={publicRoutes.login} onClick={onNavigate} size="lg">
              <UserRound data-icon="inline-start" aria-hidden="true" />
              Sign in
            </ButtonLink>
            <ButtonLink href={publicRoutes.register} onClick={onNavigate} size="lg" variant="outline">
              <UserPlus data-icon="inline-start" aria-hidden="true" />
              Create an account
            </ButtonLink>
          </Box>
        )}
      </SheetFooter>
    </>
  );
}
