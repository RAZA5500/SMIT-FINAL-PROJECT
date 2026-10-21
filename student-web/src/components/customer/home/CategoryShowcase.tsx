"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryTheme, packshotUrl, TONE_CLASSES } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { CATEGORY_LIST_LIMIT } from "../layout/CategoryBar";
import { buildCategoryTree, totalProducts } from "../shop/category-tree";

const MAX_TILES = 8;

/** "Shop by aisle" — asli top-level categories, har ek ka tint + packshot */
export function CategoryShowcase() {
  const { data, isLoading, isError, error, refetch } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const roots = useMemo(() => buildCategoryTree(data?.data ?? []).slice(0, MAX_TILES), [data]);

  // Categories hi nahi (naya store) — section chhupao, khali dabba nahi
  if (!isLoading && !isError && roots.length === 0) return null;

  return (
    <section className="container-page flex flex-col gap-5" aria-labelledby="aisles-heading">
      <div className="flex flex-col gap-1">
        <h2 id="aisles-heading" className="text-2xl font-bold sm:text-3xl">
          Shop by aisle
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">Everything for the week, neatly sorted.</p>
      </div>

      {isError ? (
        <ErrorState title="Couldn't load categories" message={error.message} onRetry={() => void refetch()} className="py-8" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }, (_, i) => (
                <li key={i}>
                  <Skeleton className="aspect-5/4 w-full rounded-3xl" />
                </li>
              ))
            : roots.map((root) => {
                const theme = categoryTheme(root.name);
                const tone = TONE_CLASSES[theme.tone];
                const Icon = theme.icon;
                const count = totalProducts(root);
                return (
                  <li key={root.id}>
                    <Link
                      href={shopUrl({ category: root.id })}
                      className={cn(
                        "group/tile relative isolate flex aspect-5/4 flex-col justify-between overflow-hidden rounded-3xl p-4 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-5",
                        tone.tile,
                      )}
                    >
                      <span className="relative z-10 flex flex-col gap-0.5">
                        <span className="font-heading text-lg leading-tight font-bold text-foreground sm:text-xl">
                          {root.name}
                        </span>
                        <span className="text-xs font-medium text-foreground/60">
                          {count} {count === 1 ? "product" : "products"}
                        </span>
                      </span>
                      <span className="relative z-10 flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-transform group-hover/tile:rotate-45">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                      {theme.image ? (
                        <span className="absolute -right-2 -bottom-3 size-3/5 transition-transform duration-500 group-hover/tile:scale-110">
                          <Image
                            src={packshotUrl(theme.image)}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 180px, 30vw"
                            className="blend-packshot object-contain"
                          />
                        </span>
                      ) : (
                        <Icon
                          className={cn("absolute -right-3 -bottom-4 size-1/2 opacity-80", tone.icon)}
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
        </ul>
      )}
    </section>
  );
}
