"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Frozen Foods",
    description: "Convenient frozen food options that are quick and easy to prepare.",
    image: "/media/categories/0f956e83.jpg",
  },
  {
    title: "Bakery",
    description: "Freshly baked bread, cakes, and pastries for every occasion.",
    image: "/media/categories/84de47f9.jpg",
  },
  {
    title: "Meat & Poultry",
    description: "Quality meat and poultry cuts for delicious homemade meals.",
    image: "/media/categories/72aedb48.jpg",
  },
  {
    title: "Dairy & Eggs",
    description: "Fresh dairy products and eggs for everyday cooking and breakfast.",
    image: "/media/categories/dcf14d04.jpg",
  },
];

/* Tailwind only picks up complete class strings, so both states are spelled out. */
const FLIP_FACE_DOWN =
  "relative w-full h-full transition-transform duration-700 transform-3d group-hover/card:rotate-y-180 group-focus-visible/card:rotate-y-180";
const FLIP_FACE_UP =
  "relative w-full h-full transition-transform duration-700 transform-3d rotate-y-180 group-hover/card:rotate-y-180 group-focus-visible/card:rotate-y-180";

export default function CategorySection() {
  /* The live site flips every card face-up once the row scrolls into view and
     leaves them that way; hover/focus simply hold the same rotation. */
  const gridRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFlipped(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <div className="mx-auto px-6 md:px-4 max-w-product-grid">
        <div>
          <div className="mb-5 md:mb-8 text-center">
            <h2 className="inline-block mx-auto pb-2 border-brand-green border-b-4 md:max-w-sm font-inter section-heading">
              Our Best Categories
            </h2>
          </div>

          <div
            ref={gridRef}
            className="justify-center items-stretch gap-best-category-sm lg:gap-best-category grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto w-full sm:w-fit"
            aria-label="Best categories"
          >
            <span className="sr-only">
              Cards flip automatically when this section becomes visible. You can also focus or hover a card to
              flip it.
            </span>

            {CATEGORIES.map((c) => (
              <Link className="focus:outline-none h-full w-full sm:w-auto" href="/shop" key={c.title}>
                <div className="group/card focus:outline-none w-full sm:w-best-category-card-sm xl:w-best-category-card h-full perspective-flip cursor-pointer">
                  <div className={flipped ? FLIP_FACE_UP : FLIP_FACE_DOWN}>
                    {/* Detail face — turned away until the card flips */}
                    <div className="h-full rotate-y-180 backface-hidden">
                      <div
                        data-slot="card"
                        className="group/card rounded-lg bg-card text-xs/relaxed text-card-foreground overflow-hidden p-0 ring-0 shadow-[0px_4px_20px_0px_#00000026] flex flex-col h-full"
                      >
                        <div
                          data-slot="card-content"
                          className="flex flex-row sm:flex-col p-0 sm:p-1 md:p-2 h-full"
                        >
                          <div className="relative bg-gray-50 shrink-0 w-36 h-36 sm:w-full sm:h-best-category-image-sm xl:h-best-category-image">
                            <Image
                              alt={c.title}
                              fill
                              sizes="(max-width: 640px) 144px, 300px"
                              className="rounded md:rounded-md object-cover object-center"
                              src={c.image}
                            />
                          </div>
                          <div className="flex flex-col flex-1 justify-between items-start sm:items-center px-3 py-2.5 sm:px-0 sm:py-0 sm:pt-1 lg:pt-2 text-left sm:text-center min-w-0">
                            <div className="w-full">
                              <h3 className="w-full font-inter font-bold text-gray-900 text-sm md:text-base line-clamp-2 leading-tight">
                                {c.title}
                              </h3>
                              <p className="pt-0.5 md:pt-1 lg:pt-2 w-full font-inter font-normal text-gray-600 text-xs md:text-sm line-clamp-2 leading-tight">
                                {c.description}
                              </p>
                            </div>
                            <span className="inline-flex justify-center items-center bg-brand-green hover:opacity-95 mt-2 sm:mt-1 md:mt-2 px-3 md:px-6 rounded-5 h-8 md:h-9 font-inter font-medium text-white text-xs md:text-sm leading-none active:scale-95 transition-all hover:-translate-y-0.5 duration-200 cursor-pointer shrink-0">
                              Order Now
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover face */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden backface-hidden">
                      <Image
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover"
                        src="/category-card-back.png"
                      />
                      <div className="absolute inset-0 flex justify-center items-center">
                        <h3 className="px-4 font-bold text-fs-8 text-white text-center leading-none">
                          {c.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
