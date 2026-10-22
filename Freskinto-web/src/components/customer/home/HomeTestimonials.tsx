"use client";

import { BadgeCheck, Quote, Star } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Flex, Stack } from "@/components/ui/flex";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TESTIMONIALS } from "@/data/testimonials";
import { cn, initials } from "@/lib/utils";

const FEATURED = TESTIMONIALS.filter((item) => item.featured);
/** Average sirf dikhaye gaye reviews ka — koi bahar ka number nahi */
const AVERAGE = (FEATURED.reduce((sum, item) => sum + item.rating, 0) / FEATURED.length).toFixed(1);

function Stars({ rating }: { rating: number }) {
  return (
    <Flex gap="0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("size-4", i < rating ? "fill-tangerine text-tangerine" : "fill-muted text-muted")}
        />
      ))}
    </Flex>
  );
}

/** Shoppers ki baatein — carousel + "5★ only" filter */
export function HomeTestimonials() {
  const [filter, setFilter] = useState<"all" | "five">("all");
  const items = FEATURED.filter((item) => filter === "all" || item.rating === 5);

  return (
    <Stack as="section" aria-labelledby="testimonials-heading" gap="8">
      <SectionHeading
        id="testimonials-heading"
        eyebrow={`★ ${AVERAGE} average from ${FEATURED.length} reviews`}
        title="Loved By Local Shoppers"
        description="What neighbours say after their first few shops."
        actions={
          <ToggleGroup
            aria-label="Filter reviews"
            variant="chip"
            size="sm"
            value={[filter]}
            onValueChange={(next) => next[0] && setFilter(next[0] as "all" | "five")}
          >
            <ToggleGroupItem value="all">All ({FEATURED.length})</ToggleGroupItem>
            <ToggleGroupItem value="five">5-Star Only</ToggleGroupItem>
          </ToggleGroup>
        }
      />

      <Carousel key={filter} opts={{ align: "start" }} aria-label="Customer reviews">
        <CarouselContent className="-ml-4 py-2">
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card
                className={cn(
                  "h-full justify-between rounded-3xl border-2 shadow-none",
                  index % 3 === 1 && "bg-plum-soft",
                  index % 3 === 2 && "bg-lime-soft",
                )}
              >
                <CardContent className="flex flex-col gap-4">
                  <Flex align="center" justify="between">
                    <Stars rating={item.rating} />
                    <Quote aria-hidden="true" className="size-8 text-primary/20" />
                  </Flex>
                  <Text family="heading" weight="medium" className="text-lg leading-snug">
                    “{item.text}”
                  </Text>
                </CardContent>
                <CardFooter className="justify-between gap-3 bg-transparent">
                  <Flex align="center" gap="3">
                    <Avatar>
                      <AvatarImage src={item.photo} alt="" />
                      <AvatarFallback>{initials(item.customer)}</AvatarFallback>
                    </Avatar>
                    <Stack gap="0.5">
                      <Text weight="bold" className="text-fs-13">
                        {item.customer}
                      </Text>
                      <Flex align="center" gap="1" className="text-fs-11 font-medium text-success-ink">
                        <BadgeCheck aria-hidden="true" className="size-3" />
                        Verified shopper
                      </Flex>
                    </Stack>
                  </Flex>
                  <Badge variant="outline" className="font-normal text-muted-foreground">
                    {item.date}
                  </Badge>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <Flex align="center" justify="between" className="mt-5">
          <CarouselDots className="text-primary" />
          <Flex gap="2">
            <CarouselPrevious className="static size-10 translate-y-0 border-2" />
            <CarouselNext className="static size-10 translate-y-0 border-2" />
          </Flex>
        </Flex>
      </Carousel>
    </Stack>
  );
}
