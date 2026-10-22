import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StarRating } from "@/components/shared/StarRating";
import { TESTIMONIALS } from "@/data/testimonials";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Static design content (user decision: home reviews section is a static mock) */
const FEATURED = TESTIMONIALS.filter((testimonial) => testimonial.featured).slice(0, 3);

/** "Notes from the neighbourhood" — customer quotes as handwritten-feel cards */
export function NeighbourNotes() {
  return (
    <Container as="section" aria-labelledby="notes-heading">
      <Stack gap="8">
        <SectionHeading id="notes-heading" eyebrow="Kind words" title="Notes from the neighbourhood" />
        <Grid as="ul" gap="4" className={cn("md:grid-cols-3")}>
          {FEATURED.map((note) => (
            <Box as="li" key={note.id}>
              <Card className={cn("h-full rounded-2xl border-border/80 bg-white shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-1")}>
                <CardHeader>
                  <Flex align="center" justify="between">
                    <StarRating rating={note.rating} />
                    <Quote aria-hidden="true" className={cn("size-5 text-brand-green/30 fill-brand-green/20")} />
                  </Flex>
                </CardHeader>
                <CardContent className={cn("flex-1")}>
                  <Text as="blockquote" className={cn("text-base leading-relaxed text-foreground/90 font-normal")}>
                    “{note.text}”
                  </Text>
                </CardContent>
                <CardFooter className={cn("gap-3 border-t border-border/60 bg-muted/20")}>
                  <Avatar>
                    <AvatarImage src={note.photo} alt="" />
                    <AvatarFallback className={cn("bg-brand-soft text-brand-strong font-semibold")}>{initials(note.customer)}</AvatarFallback>
                  </Avatar>
                  <Stack gap="0.5">
                    <Text as="span" weight="semibold" className={cn("text-sm font-semibold text-foreground")}>
                      {note.customer}
                    </Text>
                    <Text as="span" variant="small" tone="muted" className={cn("text-xs text-muted-foreground")}>
                      {note.date}
                    </Text>
                  </Stack>
                </CardFooter>
              </Card>
            </Box>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
