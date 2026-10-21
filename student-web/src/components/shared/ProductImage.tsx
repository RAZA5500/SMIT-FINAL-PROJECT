import Image from "next/image";
import { productVisual, TONE_CLASSES } from "@/lib/merchandising";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  name: string;
  categoryName?: string;
  /** Khali = decorative (card mein naam saath likha hai) */
  alt?: string;
  sizes?: string;
  /** Pehli screen (above the fold) — lazy load nahi */
  eager?: boolean;
  className?: string;
  /** Photo ke gird padding — thumbnails par kam */
  imageClassName?: string;
  /** Sold out products dhundle dikhte hain */
  muted?: boolean;
}

/**
 * Product visual: demo packshot (white background, multiply-blended onto a warm
 * studio tile) or — when no photo fits — the category icon on its tint.
 */
export function ProductImage({
  name,
  categoryName,
  alt = "",
  sizes = "(min-width: 1280px) 240px, (min-width: 768px) 30vw, 45vw",
  eager = false,
  className,
  imageClassName,
  muted = false,
}: ProductImageProps) {
  const { image, theme } = productVisual(name, categoryName);
  const tone = TONE_CLASSES[theme.tone];
  const Icon = theme.icon;

  return (
    <div
      className={cn(
        "relative isolate flex aspect-square items-center justify-center overflow-hidden",
        image ? "bg-linear-to-b from-cream to-muted" : tone.tile,
        muted && "grayscale",
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className={cn("blend-packshot object-contain p-3", muted && "opacity-60", imageClassName)}
        />
      ) : (
        <Icon
          className={cn("size-2/5", tone.icon, muted && "opacity-50")}
          strokeWidth={1.4}
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        />
      )}
    </div>
  );
}
