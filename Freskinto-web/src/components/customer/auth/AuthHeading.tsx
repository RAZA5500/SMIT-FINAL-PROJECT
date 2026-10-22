import type { ReactNode } from "react";

interface AuthHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}

/** Auth form ke upar kicker + serif headline + ek line — page.tsx sirf compose karta hai */
export function AuthHeading({ eyebrow, title, subtitle }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="kicker">{eyebrow}</p>
      <h1 className="font-heading text-fs-40 text-foreground">{title}</h1>
      <p className="text-muted-foreground sm:text-base">{subtitle}</p>
    </div>
  );
}
