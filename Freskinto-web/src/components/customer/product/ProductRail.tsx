"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

const ITEM_CLASS = "w-40 shrink-0 snap-start xs:w-44 sm:w-52 lg:w-56";

interface ProductRailProps {
  title: string;
  description?: string;
  /** "View all" link */
  href?: string;
  eyebrow?: ReactNode;
  products: IProduct[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  errorTitle?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
}

/** Horizontal product shelf — scroll-snap, arrows on desktop, swipe on touch */
export function ProductRail({
  title,
  description,
  href,
  eyebrow,
  products,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  errorTitle = "Couldn't load products",
  emptyTitle = "No products yet",
  emptyMessage = "New products will appear here soon.",
  className,
}: ProductRailProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, products]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  let body: ReactNode;
  if (isLoading) {
    body = (
      <div className="flex gap-3 overflow-hidden sm:gap-4" aria-label="Loading products" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <ProductCardSkeleton key={i} className={ITEM_CLASS} />
        ))}
      </div>
    );
  } else if (isError) {
    body = <ErrorState title={errorTitle} message={errorMessage} onRetry={onRetry} className="py-8" />;
  } else if (!products?.length) {
    body = <EmptyState title={emptyTitle} message={emptyMessage} className="py-8" />;
  } else {
    body = (
      <div
        ref={scroller}
        onScroll={measure}
        className="no-scrollbar scroll-fade-x flex snap-x snap-mandatory gap-3 overflow-x-auto py-1 sm:gap-4"
      >
        {products.map((product) => (
          <div key={product.id} className={ITEM_CLASS}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  const showArrows = !isLoading && !isError && Boolean(products?.length) && !(edges.start && edges.end);

  return (
    <section className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow}
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          {description && <p className="text-sm text-muted-foreground sm:text-base">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link
              href={href}
              className="group/link inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
            >
              View all
              <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}
          {showArrows && (
            <div className="hidden items-center gap-1.5 md:flex">
              <Button variant="outline" size="icon-sm" aria-label={`Scroll ${title} left`} disabled={edges.start} onClick={() => scrollBy(-1)}>
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon-sm" aria-label={`Scroll ${title} right`} disabled={edges.end} onClick={() => scrollBy(1)}>
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
      {body}
    </section>
  );
}
