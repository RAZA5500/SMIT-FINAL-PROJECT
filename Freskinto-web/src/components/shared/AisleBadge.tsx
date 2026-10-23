import Image from "next/image";
import type { CSSProperties } from "react";
import { Flex } from "@/components/ui/flex";
import { categoryTheme, packshotUrl } from "@/lib/merchandising";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-8 [&_svg]:size-4",
  md: "size-11 [&_svg]:size-5",
  lg: "size-14 [&_svg]:size-6",
} as const;

interface AisleBadgeProps {
  /** Category / aisle naam — icon, rang aur photo isi se */
  name: string | undefined;
  size?: keyof typeof SIZES;
  /** Photo (cutout) dikhaye agar mile, warna icon */
  photo?: boolean;
  className?: string;
}

/** Aisle ka chhota gol nishaan: uske aura rang par cutout photo ya icon (menus, filters, admin) */
export function AisleBadge({ name, size = "md", photo = true, className }: AisleBadgeProps) {
  const theme = categoryTheme(name);
  const Icon = theme.icon;
  const image = photo && theme.image ? packshotUrl(theme.image) : null;

  return (
    <Flex
      as="span"
      align="center"
      justify="center"
      aria-hidden="true"
      style={{ "--aura": theme.aura } as CSSProperties}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--aura)_20%,var(--card))] text-[color-mix(in_oklab,var(--aura)_62%,var(--foreground))]",
        SIZES[size],
        className,
      )}
    >
      {image ? <Image src={image} alt="" fill sizes="56px" className="object-contain p-[14%]" /> : <Icon />}
    </Flex>
  );
}
