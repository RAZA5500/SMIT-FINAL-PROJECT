import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { initials } from "@/lib/utils";

const FEATURED = TESTIMONIALS.filter((item) => item.featured);
/** Average sirf dikhaye gaye reviews ka — koi bahar ka number nahi */
const AVERAGE = (FEATURED.reduce((sum, item) => sum + item.rating, 0) / FEATURED.length).toFixed(1);
const HALF = Math.ceil(FEATURED.length / 2);

function ReviewCard({ review }: { review: Testimonial }) {
  return (
    <Card className="w-80 shrink-0 gap-4 rounded-[1.75rem] p-6 sm:w-96">
      <Flex align="center" justify="between">
        <Flex gap="0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className={index < review.rating ? "size-4 fill-[#ffc53d] text-[#ffc53d]" : "size-4 fill-muted text-muted"}
            />
          ))}
        </Flex>
        <Quote aria-hidden="true" className="size-6 text-brand/50" />
      </Flex>
      <Text className="text-[0.95rem] leading-relaxed">“{review.text}”</Text>
      <Flex align="center" gap="3" className="mt-auto">
        <Avatar>
          <AvatarImage src={review.photo} alt="" />
          <AvatarFallback>{initials(review.customer)}</AvatarFallback>
        </Avatar>
        <Stack gap="0.5">
          <Text weight="bold">{review.customer}</Text>
          <Text tone="muted" className="text-fs-12">
            Shared via {review.source.toLowerCase()} · {review.date}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}

/** "Loved locally" — do qataron mein reviews ulti dishaon mein bahte hain (hover par rukte hain) */
export function HomeReviews() {
  return (
    <Stack as="section" aria-labelledby="reviews-heading" gap="10">
      <Container>
        <Reveal>
          <SectionHeading
            id="reviews-heading"
            eyebrow="Reviews"
            title={
              <>
                Loved{" "}
                <Text as="em" variant="accent">
                  locally
                </Text>
              </>
            }
            actions={
              <Flex align="center" gap="2" className="glass rounded-full border border-glass-border px-4 py-2">
                <Star aria-hidden="true" className="size-4 fill-[#ffc53d] text-[#ffc53d]" />
                <Text as="span" weight="bold">
                  {AVERAGE} / 5
                </Text>
                <Text as="span" tone="muted" className="text-fs-13">
                  from {FEATURED.length} reviews
                </Text>
              </Flex>
            }
          />
        </Reveal>
      </Container>
      <Stack gap="4">
        <Marquee duration="60s" aria-label="Customer reviews" trackClassName="gap-4 pr-4 py-2">
          {FEATURED.slice(0, HALF).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Marquee>
        <Marquee duration="70s" reverse trackClassName="gap-4 pr-4 py-2">
          {FEATURED.slice(HALF).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Marquee>
      </Stack>
    </Stack>
  );
}
