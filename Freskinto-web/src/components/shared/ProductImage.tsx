import Image from "next/image";
import type { CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
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
  /** `well`: aura se rangi narm tray (cards) · `bare`: sirf glow, koi tray nahi (hero, orbit) */
  stage?: "well" | "bare";
}

/**
 * Product visual: background-free packshot jo apne hi rang ke glow ("aura") par tairta hai — ya,
 * jab koi photo fit na ho, category icon. Default square. `group/product` hover par glow phailta hai.
 */
export function ProductImage({
  name,
  categoryName,
  alt = "",
  sizes = "(min-width: 1280px) 280px, (min-width: 768px) 30vw, 45vw",
  eager = false,
  className,
  imageClassName,
  muted = false,
  stage = "well",
}: ProductImageProps) {
  const { image, theme, aura } = productVisual(name, categoryName);
  const Icon = theme.icon;

  return (
    <Flex
      align="center"
      justify="center"
      style={{ "--aura": aura } as CSSProperties}
      className={cn("relative isolate aspect-square", stage === "well" && "aura-wash", muted && "grayscale", className)}
    >
      <Box
        aria-hidden="true"
        className="aura absolute inset-[6%] -z-10 rounded-full transition-[scale,opacity] duration-700 ease-out-expo group-hover/product:scale-115"
      />
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className={cn(
            "product-float object-contain p-[13%] transition-[translate,rotate,scale] duration-700 ease-out-expo",
            muted && "opacity-60",
            imageClassName,
          )}
        />
      ) : (
        <Icon
          className={cn(
            "size-1/3 text-[color-mix(in_oklab,var(--aura)_60%,var(--foreground))]",
            muted && "opacity-50",
          )}
          strokeWidth={1.3}
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        />
      )}
    </Flex>
  );
}
