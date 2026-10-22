"use client";

import { Plus, Quote } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { StarRating } from "@/components/shared/StarRating";
import { TESTIMONIALS } from "@/data/testimonials";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TestimonialsView() {
  const [featured, setFeatured] = useState(() => new Set(TESTIMONIALS.filter((item) => item.featured).map((item) => item.id)));

  const toggle = (id: string, on: boolean) =>
    setFeatured((current) => {
      const next = new Set(current);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <AdminPage
      demo
      eyebrow="Marketing"
      title="Testimonials"
      description="Kind words from shoppers. Featured ones appear in “What shoppers say” on the home page — changes here aren't saved."
      meta={
        <Text as="span" variant="small" tone="muted" numeric>
          {featured.size} of {TESTIMONIALS.length} featured
        </Text>
      }
      actions={
        <Button onClick={() => demoAction("Adding testimonials")}>
          <Plus data-icon="inline-start" aria-hidden="true" />
          Add testimonial
        </Button>
      }
    >
      <Grid gap="5" className={cn("md:grid-cols-2 xl:grid-cols-3")}>
        {TESTIMONIALS.map((item) => {
          const isFeatured = featured.has(item.id);
          const switchId = `featured-${item.id}`;
          return (
            <Card key={item.id} className={cn("transition-shadow", isFeatured && "ring-primary/40")}>
              <CardContent className={cn("flex flex-1 flex-col gap-4")}>
                <Flex align="center" justify="between" gap="3">
                  <Quote aria-hidden="true" className={cn("size-6 fill-primary/10 text-brand-green")} />
                  <StarRating rating={item.rating} size="sm" />
                </Flex>
                <Text as="blockquote" size="lg" className={cn("text-base font-normal leading-relaxed text-foreground")}>
                  {item.text}
                </Text>
                <Flex align="center" gap="3" className={cn("mt-auto")}>
                  <Avatar size="lg">
                    <AvatarImage src={item.photo} alt="" />
                    <AvatarFallback>{initials(item.customer)}</AvatarFallback>
                  </Avatar>
                  <Stack gap="0.5" className={cn("min-w-0")}>
                    <Text weight="semibold">{item.customer}</Text>
                    <Text variant="small" tone="muted">
                      {item.source} · {item.date}
                    </Text>
                  </Stack>
                </Flex>
              </CardContent>
              <CardFooter className={cn("justify-between gap-3 py-3")}>
                <Flex align="center" gap="2.5">
                  <Switch id={switchId} checked={isFeatured} onCheckedChange={(on) => toggle(item.id, on)} />
                  <Label htmlFor={switchId}>Feature on home page</Label>
                </Flex>
                {isFeatured && <Badge variant="success">Featured</Badge>}
              </CardFooter>
            </Card>
          );
        })}
      </Grid>
    </AdminPage>
  );
}
