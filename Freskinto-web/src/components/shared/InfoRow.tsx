import type { ReactNode } from "react";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}

/** Icon tile + chhota label + value (shadcn `Item`) — order details, profile, customer modal */
export function InfoRow({ icon, label, children, className }: InfoRowProps) {
  return (
    <Item size="xs" className={cn("items-start gap-3 p-0", className)}>
      <ItemMedia
        aria-hidden="true"
        className="size-9 translate-y-0 rounded-xl bg-plum-soft text-primary group-has-data-[slot=item-description]/item:translate-y-0 [&_svg]:size-4"
      >
        {icon}
      </ItemMedia>
      <ItemContent className="min-w-0 gap-0.5">
        <ItemDescription className="text-fs-12">{label}</ItemDescription>
        <ItemTitle className="line-clamp-none w-full font-normal text-foreground">{children}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
