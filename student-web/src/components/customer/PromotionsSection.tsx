import Image from "next/image";
import Link from "next/link";

const CDN = "/media/promotions";

type Promo = {
  title: string;
  kind: "video" | "image";
  src: string;
};

const PROMOS: Promo[] = [
  { title: "Bakery Treats Sale", kind: "video", src: `${CDN}/videos/49469308.mp4` },
  { title: "Meat & Chicken Savings", kind: "image", src: `${CDN}/thumbnails/304289c5.jpg` },
  { title: "Frozen Food Favorites", kind: "image", src: `${CDN}/thumbnails/0f678910.jpg` },
];

const CTA_CLASS =
  "mt-2 md:mt-(--space-promo-cta-mt) inline-flex items-center justify-center gap-1 md:gap-1.5 bg-white text-brand-green h-4.5 md:h-promo-cta w-auto md:min-w-(--size-promo-cta-w) rounded-5 px-3 md:px-4 py-1.5 md:py-0 font-inter text-fs-6 md:text-sm font-semibold leading-120 md:leading-tight hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white/60";

function PromoCard({ promo }: { promo: Promo }) {
  return (
    <div className="relative rounded-2xl w-full h-44 md:h-56 lg:h-88 xl:h-promo-card overflow-hidden">
      {promo.kind === "video" ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={promo.src}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <Image
          alt=""
          fill
          sizes="(max-width: 768px) 33vw, 33vw"
          className="object-cover"
          src={promo.src}
        />
      )}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/45 to-black/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h3 className="pt-1.5 md:pt-(--space-promo-title-pt) text-center font-inter font-semibold text-white text-base leading-120 lg:text-3xl xl:text-promo-title md:leading-tight line-clamp-3">
          {promo.title}
        </h3>
        <Link className={CTA_CLASS} href="/shop">
          <span>View product</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-1.5 h-1.25 md:size-4 text-brand-green"
          >
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M13 5L20 12L13 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function PromotionsSection() {
  return (
    <section>
      <div className="product-container">
        <div className="flex justify-between items-center mb-2 md:mb-8">
          <h2 className="section-heading">Promotions</h2>
        </div>

        <div className="grid gap-3 md:hidden grid-cols-3">
          {PROMOS.map((p) => (
            <PromoCard key={p.title} promo={p} />
          ))}
        </div>

        <div className="hidden md:flex md:gap-6 md:justify-center">
          {PROMOS.map((p) => (
            <div className="md:basis-1/3 md:shrink-0" key={p.title}>
              <PromoCard promo={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
