import Image from "next/image";

export default function FreeDeliveryBanner() {
  return (
    <section className="relative w-full overflow-hidden max-md:h-20 h-48" aria-label="Free delivery banner">
      <Image
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        src="/banners/free-delivery-banner.png"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center justify-center text-center gap-1 px-2 py-1 mx-4 md:gap-2.5 md:px-5.5 md:py-2.5 md:mx-10 border border-dashed border-white/90 md:border-2">
          <span className="font-inter font-normal leading-none text-white text-sm md:text-3xl lg:text-4xl">
            Free Delivery When You Spend Over £60
          </span>
        </div>
      </div>
    </section>
  );
}
