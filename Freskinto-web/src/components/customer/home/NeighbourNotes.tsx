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
          {FEATURED.map((note, index) => (
            <Box as="li" key={note.id}>
              <Card className={cn("h-full bg-paper", index === 1 ? "md:-rotate-1" : "md:rotate-1")}>
                <CardHeader>
                  <Flex align="center" justify="between">
                    <StarRating rating={note.rating} />
                    <Quote aria-hidden="true" className={cn("size-6 fill-primary text-primary")} />
                  </Flex>
                </CardHeader>
                <CardContent className={cn("flex-1")}>
                  <Text as="blockquote" family="serif" className={cn("text-lg leading-relaxed italic")}>
                    “{note.text}”
                  </Text>
                </CardContent>
                <CardFooter className={cn("gap-3 border-dashed bg-transparent")}>
                  <Avatar>
                    <AvatarImage src={note.photo} alt="" />
                    <AvatarFallback>{initials(note.customer)}</AvatarFallback>
                  </Avatar>
                  <Stack gap="0.5">
                    <Text as="span" weight="semibold">
                      {note.customer}
                    </Text>
                    <Text as="span" variant="code" tone="muted">
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
