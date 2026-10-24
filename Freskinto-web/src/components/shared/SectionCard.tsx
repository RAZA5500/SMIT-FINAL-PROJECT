import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Header ke right par (badge, button) */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Page ke andar ek titled panel (shadcn Card) — orders, profile, forms; header hairline se alag */
export function SectionCard({ title, description, icon, action, children, className, bodyClassName }: SectionCardProps) {
  return (
    <Card render={<Box as="section" />} className={cn("gap-0 rounded-[1.75rem] py-0", className)}>
      <CardHeader className="border-b border-border py-4">
        <CardTitle render={<Box as="span" />}>
          <Flex as="span" align="center" gap="2.5" className="text-base font-semibold">
            {icon && (
              <Flex
                as="span"
                align="center"
                justify="center"
                aria-hidden="true"
                className="size-8 rounded-xl bg-muted/80 text-muted-foreground shadow-xs [&_svg]:size-4"
              >
                {icon}
              </Flex>
            )}
            {title}
          </Flex>
        </CardTitle>
        {description && <CardDescription className="text-fs-13">{description}</CardDescription>}
        {action && <CardAction className="top-3.5">{action}</CardAction>}
      </CardHeader>
      <CardContent className={cn("p-5", bodyClassName)}>{children}</CardContent>
    </Card>
  );
}
