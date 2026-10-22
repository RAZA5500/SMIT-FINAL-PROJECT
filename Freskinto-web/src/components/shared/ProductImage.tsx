import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { productVisual } from "@/lib/merchandising";
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
 * Product visual: demo packshot (shot on white, multiply-blended onto a stone
 * tile) or — when no photo fits — the category icon. Square by default.
 */
export function ProductImage({
  name,
  categoryName,
  alt = "",
  sizes = "(min-width: 1280px) 260px, (min-width: 768px) 30vw, 45vw",
  eager = false,
  className,
  imageClassName,
  muted = false,
}: ProductImageProps) {
  const { image, theme } = productVisual(name, categoryName);
  const Icon = theme.icon;

  return (
    <AspectRatio
      ratio={1}
      className={cn("isolate flex items-center justify-center overflow-hidden bg-muted", muted && "grayscale", className)}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className={cn("blend-packshot object-contain p-4", muted && "opacity-60", imageClassName)}
        />
      ) : (
        <Icon
          className={cn("size-2/5 text-brand", muted && "opacity-50")}
          strokeWidth={1.3}
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        />
      )}
    </AspectRatio>
  );
}
