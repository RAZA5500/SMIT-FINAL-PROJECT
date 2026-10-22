"use client";

import { ChevronRight, House, LayoutGrid, LogOut, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Logo } from "@/components/shared/Logo";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLogout } from "@/hooks/useLogout";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";
import { buildCategoryTree } from "../shop/category-tree";
import { accountLinks } from "./AccountMenu";
import { CATEGORY_LIST_LIMIT } from "./CategoryBar";

const ROW_CLASS =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted";

/** Mobile navigation drawer — categories + account */
export function MobileMenu() {
  const open = useUiStore((state) => state.menuOpen);
  const setOpen = useUiStore((state) => state.setMenuOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-full max-w-xs gap-0 p-0">
        <MobileMenuBody onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function MobileMenuBody({ onNavigate }: { onNavigate: () => void }) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const { data } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const roots = useMemo(() => buildCategoryTree(data?.data ?? []), [data]);
  const signedIn = token ? user : null;

  return (
    <>
      <SheetHeader className="border-b px-5 py-4">
        <SheetTitle render={<Link href={publicRoutes.home} onClick={onNavigate} />}>
          <Logo size="sm" />
        </SheetTitle>
        <SheetDescription className="sr-only">Browse categories and your account</SheetDescription>
      </SheetHeader>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
        <Link href={publicRoutes.home} onClick={onNavigate} className={ROW_CLASS}>
          <House className="size-5 text-muted-foreground" aria-hidden="true" />
          Home
        </Link>
        <Link href={shopUrl()} onClick={onNavigate} className={ROW_CLASS}>
          <LayoutGrid className="size-5 text-muted-foreground" aria-hidden="true" />
          All products
        </Link>

        {roots.length > 0 && (
          <>
            <p className="px-3 pt-5 pb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Shop by category
            </p>
            {roots.map((root) => {
              const theme = categoryTheme(root.name);
              const Icon = theme.icon;
              return (
                <Link key={root.id} href={shopUrl({ category: root.id })} onClick={onNavigate} className={ROW_CLASS}>
                  <span className={cn("flex size-8 items-center justify-center rounded-lg", TONE_CLASSES[theme.tone].tile)}>
                    <Icon className={cn("size-4", TONE_CLASSES[theme.tone].icon)} aria-hidden="true" />
                  </span>
                  <span className="flex-1">{root.name}</span>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              );
            })}
          </>
        )}

        <p className="px-3 pt-5 pb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Account</p>
        {signedIn ? (
          <>
            {accountLinks(signedIn).map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={onNavigate} className={ROW_CLASS}>
                <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <button
              type="button"
              className={cn(ROW_CLASS, "w-full text-destructive")}
              onClick={() => {
                onNavigate();
                logout();
              }}
            >
              <LogOut className="size-5" aria-hidden="true" />
              Sign out
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 px-1 pt-1">
            <Link href={publicRoutes.login} onClick={onNavigate} className={buttonVariants({ size: "lg" })}>
              <UserRound aria-hidden="true" />
              Sign in
            </Link>
            <Link
              href={publicRoutes.register}
              onClick={onNavigate}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <UserPlus aria-hidden="true" />
              Create an account
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
