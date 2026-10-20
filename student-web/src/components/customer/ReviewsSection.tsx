"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const CDN = "/media/testimonials";

type Testimonial = {
  name: string;
  quote: string;
  rating: number;
  avatar?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Harry Johnson",
    quote:
      "The products were good and the website was easy to use. Delivery was a little later than expected.",
    rating: 3,
    avatar: `${CDN}/003e858b-d109-4d0b-9f4c-8b7e78c88d30/defaf71d.jpg`,
  },
  {
    name: "Charlotte Davies",
    quote: "Absolutely brilliant. The bakery items were fresh and delicious. I'll definitely order again.",
    rating: 5,
    avatar: `${CDN}/a28c1561-c2a4-438f-84ad-56218f216311/7d71b9b0.jpg`,
  },
  {
    name: "Jack Harrison",
    quote: "Very convenient service with plenty of choice. The order arrived well chilled and nicely packed.",
    rating: 4,
    avatar: `${CDN}/e182b0cf-e490-4719-a2cd-71239e879fa5/9f94ce79.jpg`,
  },
  {
    name: "Sophie Williams",
    quote: "Everything was packed carefully and arrived in perfect condition. Really happy with the quality.",
    rating: 5,
    avatar: `${CDN}/b60b9b8e-d394-4ef5-b2f4-9dd78d69a83c/238cb969.jpg`,
  },
  {
    name: "Oliver Bennett",
    quote: "Good range of products and a very easy ordering process. Delivery was quick too.",
    rating: 5,
    avatar: `${CDN}/7fa65b76-d2f0-4b21-9757-280c95524fdd/c4a53e11.jpg`,
  },
  {
    name: "Emily Thompson",
    quote: "Great service and excellent quality. The fresh produce was lovely and lasted really well.",
    rating: 5,
    avatar: `${CDN}/874ccd59-bb76-445d-8cba-ed4be4d9d128/d2a67740.jpg`,
  },
  {
    name: "James Wilson",
    quote: "Really pleased with my order. Everything arrived fresh, well packaged and right on time.",
    rating: 5,
    avatar: `${CDN}/5366abd5-8880-4d4d-bd00-ae3872993c9a/7aa2b011.jpg`,
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function QuoteGlyph() {
  return (
    <svg
      width="32"
      height="26"
      viewBox="0 0 32 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 md:w-8 h-2.5 md:h-6.5 shrink-0"
    >
      <path
        d="M8.17777 26C11.5643 26 14.3149 23.343 14.3149 20.0664C14.3149 16.7918 11.5643 14.1328 8.17777 14.1328C2.35964 14.1328 5.73109 3.82901 13.069 2.7557C13.4152 2.70635 13.7312 2.5422 13.9597 2.29295C14.1883 2.0437 14.3143 1.72582 14.3149 1.39684C14.3149 0.554394 13.513 -0.111868 12.6249 0.0157146C-0.712181 1.91527 -5.45464 25.998 8.17777 25.998V26ZM25.8607 26C29.2515 26 32 23.3451 32 20.0664C32 16.7938 29.2515 14.1369 25.8607 14.1369C20.0447 14.1369 23.4162 3.82901 30.754 2.7557C31.0999 2.7064 31.4156 2.54255 31.6441 2.29372C31.8726 2.04489 31.9988 1.72749 32 1.39887C32 0.556417 31.1981 -0.109844 30.3121 0.0177383C16.9707 1.9173 12.2283 26 25.8607 26Z"
        fill="#228B22"
      />
    </svg>
  );
}

function StarGlyph({ filled }: { filled: boolean }) {
  const tone = filled ? "fill-brand-orange stroke-brand-orange" : "fill-brand-orange/20 stroke-brand-orange/20";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      className={`lucide lucide-star ${tone}`}
      aria-hidden="true"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

/* Tailwind only sees complete class strings, so both sizes are spelled out. */
const RATING_SM =
  "flex items-center gap-0 [&_svg]:[stroke-linejoin:miter] [&_svg]:[stroke-linecap:butt] [&_svg]:size-3 [&>div]:size-3";
const RATING_MD =
  "flex items-center gap-0 [&_svg]:[stroke-linejoin:miter] [&_svg]:[stroke-linecap:butt] [&_svg]:size-4 [&>div]:size-4";

function Rating({ rating, size }: { rating: number; size: "sm" | "md" }) {
  return (
    <div>
      <div className={size === "sm" ? RATING_SM : RATING_MD}>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarGlyph key={i} filled={i <= rating} />
        ))}
      </div>
    </div>
  );
}

function Avatar({ t, px, fontSize }: { t: Testimonial; px: number; fontSize: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full overflow-hidden bg-gray-900 text-white font-semibold shrink-0"
      style={{ width: `${px}px`, height: `${px}px`, fontSize: `${fontSize}px` }}
      aria-label={t.name}
    >
      {t.avatar ? (
        <Image alt={t.name} fill sizes={`${px}px`} className="object-cover" src={t.avatar} />
      ) : (
        initials(t.name)
      )}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article
      className="shrink-0 w-42.5 h-auto rounded-lg bg-white p-2.5 flex flex-col md:w-106 md:h-58.25 md:p-8.5 border border-gray-200"
      role="group"
      aria-label={`${t.name} testimonial`}
    >
      <QuoteGlyph />
      <p className="pt-1.5 md:pt-4 font-inter font-normal text-fs-10 text-gray-600 md:text-sm leading-normal line-clamp-4">
        {t.quote}
      </p>
      <div className="flex justify-between items-center mt-auto pt-2 md:pt-6">
        <div className="flex items-center gap-0.75 md:gap-3">
          <div className="md:hidden">
            <Avatar t={t} px={22} fontSize={10} />
          </div>
          <div className="hidden md:block">
            <Avatar t={t} px={56} fontSize={22} />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-inter font-medium text-fs-8 text-gray-900 md:text-base leading-none md:leading-normal">
              {t.name}
            </div>
          </div>
        </div>
        <div className="rating-icons">
          <div className="md:hidden">
            <Rating rating={t.rating} size="sm" />
          </div>
          <div className="hidden md:block">
            <Rating rating={t.rating} size="md" />
          </div>
        </div>
      </div>
    </article>
  );
}

/* The live site drives the marquee from rAF rather than a CSS animation:
   a steady 60px/s leftwards that keeps running while the pointer is over it. */
const MARQUEE_SPEED = 60;

function useMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    let last = performance.now();
    let frame = 0;

    const step = (now: number) => {
      /* Clamp so a backgrounded tab does not resume with a visible jump. */
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      /* A third of the track is one full copy of the list, so wrapping there is invisible. */
      const span = track.scrollWidth / 3;
      if (span > 0) {
        offset -= MARQUEE_SPEED * delta;
        if (-offset >= span) offset += span;
        track.style.transform = `translate3d(${offset}px, 0px, 0px)`;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return trackRef;
}

export default function ReviewsSection() {
  /* The marquee loops a tripled list, so the reset is invisible. */
  const loop = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
  const trackRef = useMarquee();

  return (
    <section aria-labelledby="client-testimonials">
      <div className="product-container flex justify-between items-center mb-4 md:mb-8">
        <h2 id="client-testimonials" className="font-inter section-heading">
          Client Testimonials
        </h2>
      </div>
      <div className="relative mx-6 md:mx-10">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-white to-transparent z-10" />
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-3 md:gap-6 px-3 md:px-4 touch-pan-x">
            {loop.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
