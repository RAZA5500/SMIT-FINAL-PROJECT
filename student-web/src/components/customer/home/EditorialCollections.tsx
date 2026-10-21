"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { CATEGORY_LIST_LIMIT } from "../layout/CategoryBar";
import { buildCategoryTree } from "../shop/category-tree";

/**
 * Editorial collections — static content (user decision: home promotions are a
 * static design), but each card deep-links into the matching live category when
 * one exists, else into a shop search.
 */
const COLLECTIONS = [
  {
    title: "Weekend produce",
    text: "Crisp greens, sweet peppers and fruit for the week ahead.",
    image: "/images/editorial/produce-market.webp",
    match: /veg|fruit|produce|salad/i,
    fallbackQuery: "fresh",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "The butcher's counter",
    text: "Chicken, beef and more — ready for the grill.",
    image: "/images/editorial/chicken-marble.webp",
    match: /poultry|chicken|meat|butcher/i,
    fallbackQuery: "chicken",
    className: "lg:col-span-2",
  },
  {
    title: "Bakery & treats",
    text: "Loaves, rolls and something sweet.",
    image: "/images/editorial/artisan-bread.webp",
    match: /bak|bread|pastr/i,
    fallbackQuery: "bread",
    className: "lg:col-span-2",
  },
];

export function EditorialCollections() {
  const { data } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const roots = useMemo(() => buildCategoryTree(data?.data ?? []), [data]);

  return (
    <section className="container-page flex flex-col gap-5" aria-labelledby="collections-heading">
      <div className="flex flex-col gap-1">
        <h2 id="collections-heading" className="text-2xl font-bold sm:text-3xl">
          Collections we love
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">Hand-picked aisles for easy inspiration.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {COLLECTIONS.map((collection, index) => {
          const category = roots.find((root) => collection.match.test(root.name));
          const href = category ? shopUrl({ category: category.id }) : shopUrl({ q: collection.fallbackQuery });
          return (
            <li key={collection.title} className={cn("min-h-64", collection.className, index === 0 && "sm:col-span-2")}>
              <Link
                href={href}
                className="group/collection relative isolate flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-3xl p-6 text-white"
              >
                <Image
                  src={collection.image}
                  alt=""
                  fill
                  sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  className="-z-20 object-cover transition-transform duration-700 group-hover/collection:scale-105"
                />
                <span className="absolute inset-0 -z-10 bg-linear-to-t from-brand-strong via-brand-strong/45 to-transparent" />
                <span className="font-display text-2xl leading-tight font-bold sm:text-3xl">{collection.title}</span>
                <span className="mt-1 max-w-sm text-sm text-white/80">{collection.text}</span>
                <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-strong transition group-hover/collection:bg-lime">
                  Shop now
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
