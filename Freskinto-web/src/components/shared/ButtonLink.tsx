import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type ButtonLinkProps = Omit<ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

/** shadcn Button jo Next `Link` render karta hai — navigation ke liye button ka look */
export function ButtonLink({ href, prefetch, replace, scroll, ...props }: ButtonLinkProps) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={href} prefetch={prefetch} replace={replace} scroll={scroll} />}
      {...props}
    />
  );
}
