import Link from "next/link";

const PRODUCT_IMAGE_STYLE: React.CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: "transparent",
};

const DESKTOP_CTA_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-5 bg-white text-brand-green shadow-none hover:bg-white hover:text-brand-green desktop:h-[77px] max-desktop:h-[50px] gap-2 px-8 desktop:px-[60px] max-desktop:text-lg desktop:text-[24px] leading-none [&_svg:not([class*='size-'])]:size-6 mt-section-md w-fit";

function ArrowGlyph({ className }: { className: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex pt-23 w-full overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* Compact hero, below md                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden relative w-full">
        <div className="relative w-full min-h-[40vh] overflow-hidden">
          <div className="bottom-0 left-0 z-0 absolute w-full">
            <img
              alt=""
              width="1440"
              height="460"
              decoding="async"
              className="w-full h-48 object-cover object-left"
              style={{ color: "transparent" }}
              src="/hero/green-wave-bg.svg"
            />
          </div>
          <div className="right-0 z-0 absolute inset-y-0 w-1/2 overflow-hidden pointer-events-none">
            <img
              alt="Fresh products"
              decoding="async"
              className="object-bottom object-contain select-none"
              style={PRODUCT_IMAGE_STYLE}
              src="/hero/product-image.svg"
            />
          </div>
          <div className="z-20 relative flex items-center mt-8 sm:mt-16 min-[400px]:mt-28 px-6 h-full">
            <div className="flex flex-col">
              <h1 className="font-inter font-semibold text-green-grey-green-grey text-2xl sm:text-3xl leading-snug">
                Fresh &amp; Healthy <br />
                Organic Food
              </h1>
              <div className="pt-2">
                <div className="flex items-start">
                  <div className="self-stretch bg-brand-green w-0.5" />
                  <div className="pl-2.5">
                    <div className="flex items-center gap-3">
                      <span className="font-inter font-medium text-gray-800 sm:text-white text-base leading-7">
                        Sale up to
                      </span>
                      <span className="inline-flex justify-center items-center bg-brand-orange px-3 py-1 rounded-badge font-inter font-medium text-white text-base leading-7">
                        30% OFF
                      </span>
                    </div>
                    <p className="pt-1.5 font-inter text-fs-10 text-gray-600 sm:text-white leading-none">
                      Free shipping on all your order.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <Link
                  className="inline-flex items-center gap-1.5 bg-white hover:opacity-95 px-7.5 py-3 rounded-5 w-fit font-inter font-semibold text-brand-green text-sm transition-opacity"
                  href="/shop"
                >
                  Shop Now
                  <ArrowGlyph className="w-4.5 h-4.5 text-brand-green" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Full hero, md and up                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block w-full">
        <div className="relative flex w-full h-[80vh] overflow-hidden">
          <div className="bottom-0 left-0 z-0 absolute w-full">
            <img
              alt=""
              width="1440"
              height="460"
              decoding="async"
              className="w-full h-auto"
              style={{ color: "transparent" }}
              src="/hero/green-wave-bg.svg"
            />
          </div>
          <div className="hidden lg:hidden md:block z-5 absolute inset-0 pointer-events-none">
            <div className="bottom-0 absolute inset-x-0 bg-linear-to-t from-black/35 to-transparent h-56" />
          </div>
          <div className="z-10 relative flex items-center mt-5 2xl:mt-0 h-full customer-container">
            <div className="flex flex-col max-w-1/2 md:max-w-[70%] lg:max-w-[60%]">
              <h1 className="mb-6 font-inter font-semibold text-green-grey-green-grey max-desktop:text-5xl desktop:text-7xl leading-tight xl:leading-none">
                Fresh &amp; Healthy <br />
                Organic Food
              </h1>
              <div className="md:z-20 md:relative flex items-start gap-hero-offer">
                <div className="bg-brand-green w-hero-offer-accent h-hero-offer-accent shrink-0" />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-inter font-medium text-white text-3xl">Sale up to</span>
                    <span className="bg-brand-orange px-badge py-badge rounded-badge font-medium text-white text-3xl">
                      30% OFF
                    </span>
                  </div>
                  <p className="pt-3 font-inter text-white text-lg">Free shipping on all your order.</p>
                </div>
              </div>
              <Link className={DESKTOP_CTA_CLASS} href="/shop">
                Shop Now
                <ArrowGlyph className="size-6 text-brand-green" />
              </Link>
            </div>
          </div>
          <div className="right-0 z-10 absolute inset-y-0 w-1/2 overflow-hidden pointer-events-none">
            <img
              alt="Fresh products"
              decoding="async"
              className="object-bottom object-contain select-none"
              style={PRODUCT_IMAGE_STYLE}
              src="/hero/product-image.svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
