import { Quote } from "lucide-react";
import Image from "next/image";
import { StarRating } from "@/components/shared/StarRating";
import { TESTIMONIALS } from "@/data/testimonials";

/** Static design content (user decision: home reviews section is a static mock) */
const FEATURED = TESTIMONIALS.filter((testimonial) => testimonial.featured);

export function ReviewsSection() {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="reviews-heading">
      <div className="container-page flex flex-col gap-1">
        <h2 id="reviews-heading" className="text-2xl font-bold sm:text-3xl">
          What shoppers say
        </h2>
      </div>
      <div className="container-page">
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {FEATURED.map((review) => (
            <li
              key={review.id}
              className="flex w-72 shrink-0 snap-start flex-col gap-4 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border md:w-auto"
            >
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                <Quote className="size-6 fill-lime text-lime" aria-hidden="true" />
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/85">“{review.text}”</blockquote>
              <div className="flex items-center gap-3">
                <Image
                  src={review.photo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover ring-2 ring-lime-soft"
                />
                <span className="text-sm font-semibold">{review.customer}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
