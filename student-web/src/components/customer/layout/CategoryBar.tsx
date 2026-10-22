"use client";

import { LayoutGrid, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/useHydrated";
import { categoryTheme } from "@/lib/merchandising";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { buildCategoryTree } from "../shop/category-tree";

/** Shop sidebar wali hi query (same key) — ek request, dono jagah cache */
export const CATEGORY_LIST_LIMIT = 100;

function CategoryPill({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </Link>
  );
}

export function CategoryBar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { data, isLoading } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  // Suspense ke andar — hydration tak server wala skeleton hi (useHydrated dekho)
  const hydrated = useHydrated();
  const roots = useMemo(() => buildCategoryTree(data?.data ?? []), [data]);

  const onShop = pathname === publicRoutes.shop;
  const activeId = onShop ? params.get("category") : null;
  // Child category select ho to us ka parent pill active
  const activeRoot = roots.find((root) => root.id === activeId || root.children.some((child) => child.id === activeId));

  return (
    <CategoryBarFrame>
      <CategoryPill href={shopUrl()} active={onShop && !activeId} icon={LayoutGrid}>
        All products
      </CategoryPill>
      {!hydrated || isLoading
        ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-full" />)
        : roots.map((root) => (
            <CategoryPill
              key={root.id}
              href={shopUrl({ category: root.id })}
              active={activeRoot?.id === root.id}
              icon={categoryTheme(root.name).icon}
            >
              {root.name}
            </CategoryPill>
          ))}
    </CategoryBarFrame>
  );
}

/** Suspense fallback — same height, no layout jump */
export function CategoryBarSkeleton() {
  return (
    <CategoryBarFrame>
      {Array.from({ length: 7 }, (_, i) => (
        <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-full" />
      ))}
    </CategoryBarFrame>
  );
}

function CategoryBarFrame({ children }: { children: React.ReactNode }) {
  return (
    <nav aria-label="Shop by category" className="border-b bg-card">
      <div className="container-page">
        <div className="no-scrollbar scroll-fade-x -mx-1 flex items-center gap-1 overflow-x-auto px-1 py-2">{children}</div>
      </div>
    </nav>
  );
}
