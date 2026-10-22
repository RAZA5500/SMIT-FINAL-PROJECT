"use client";

import { Eye, EyeOff, MessageSquareReply, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { ChipGroup, type ChipOption } from "@/components/shared/ChipGroup";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { StarRating } from "@/components/shared/StarRating";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { REVIEW_STATUSES, REVIEWS, type AdminReview, type ReviewStatus } from "@/data/admin";
import { cn } from "@/lib/utils";

const STATUS_TONES: Record<ReviewStatus, StatusTone> = {
  Pending: "warning",
  Published: "success",
  Hidden: "neutral",
};

const STATUS_OPTIONS: ChipOption<ReviewStatus | null>[] = [
  { value: null, label: "All", count: REVIEWS.length },
  ...REVIEW_STATUSES.map((status) => ({
    value: status,
    label: status,
    count: REVIEWS.filter((review) => review.status === status).length,
  })),
];

const AVERAGE = REVIEWS.reduce((sum, review) => sum + review.rating, 0) / REVIEWS.length;

/** Rating summary — average + har star ki ginti (text pehle, bar sirf sahara) */
function RatingSummary() {
  return (
    <Card className={cn("lg:sticky lg:top-24")}>
      <CardContent className={cn("flex flex-col gap-5")}>
        <Stack gap="1">
          <Text variant="eyebrow">Average rating</Text>
          <Flex align="end" gap="2">
            <Text as="span" family="serif" size="3xl" weight="semibold" numeric className={cn("leading-none")}>
              {AVERAGE.toFixed(1)}
            </Text>
            <Text as="span" tone="muted" className={cn("pb-0.5")}>
              out of 5
            </Text>
          </Flex>
          <StarRating rating={Math.round(AVERAGE)} />
          <Text variant="small" tone="muted">
            From {REVIEWS.length} sample reviews
          </Text>
        </Stack>
        <Stack as="ul" gap="2" aria-label="Reviews by rating">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = REVIEWS.filter((review) => review.rating === stars).length;
            return (
              <Flex as="li" key={stars} align="center" gap="3">
                <Flex as="span" align="center" gap="1" className={cn("w-8 shrink-0 text-sm tabular-nums [&_svg]:size-3.5")}>
                  {stars}
                  <Star aria-hidden="true" className={cn("fill-saffron text-saffron")} />
                  <Text as="span" className={cn("sr-only")}>
                    {stars === 1 ? "star" : "stars"}
                  </Text>
                </Flex>
                <Progress
                  value={(count / REVIEWS.length) * 100}
                  aria-hidden="true"
                  className={cn("flex-1 **:data-[slot=progress-track]:h-1.5")}
                />
                <Text as="span" variant="small" tone="muted" numeric className={cn("w-4 text-right")}>
                  {count}
                </Text>
              </Flex>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReviewCard({ review }: { review: AdminReview }) {
  return (
    <Card size="sm">
      <CardContent className={cn("flex flex-col gap-4")}>
        <Flex align="start" justify="between" gap="3">
          <Flex align="center" gap="3" className={cn("min-w-0")}>
            <ProductImage
              name={review.product}
              categoryName={review.category}
              sizes="48px"
              className={cn("size-12 shrink-0 rounded-xl border")}
              imageClassName={cn("p-1")}
            />
            <Stack gap="0.5" className={cn("min-w-0")}>
              <Text weight="semibold" className={cn("truncate")}>
                {review.product}
              </Text>
              <Text variant="small" tone="muted">
                {review.category}
              </Text>
            </Stack>
          </Flex>
          <StatusBadge status={review.status} tone={STATUS_TONES[review.status]} className={cn("shrink-0")} />
        </Flex>

        <Stack gap="2">
          <Flex wrap align="center" gap="2">
            <StarRating rating={review.rating} size="sm" />
            <Text as="span" variant="small" tone="muted">
              {review.customer} · {review.date}
            </Text>
          </Flex>
          <Text as="blockquote" family="serif" size="base" className={cn("border-l-2 border-primary/40 pl-4 leading-relaxed")}>
            {review.comment}
          </Text>
        </Stack>

        <Flex wrap align="center" gap="2" className={cn("border-t pt-3")}>
          {review.replied && (
            <Badge variant="secondary" className={cn("mr-auto")}>
              <MessageSquareReply aria-hidden="true" />
              Replied
            </Badge>
          )}
          <Flex gap="2" className={cn("ml-auto")}>
            <Button variant="ghost" size="sm" onClick={() => demoAction("Replying to reviews")}>
              <MessageSquareReply data-icon="inline-start" aria-hidden="true" />
              Reply
            </Button>
            {review.status === "Published" ? (
              <Button variant="outline" size="sm" onClick={() => demoAction("Hiding reviews")}>
                <EyeOff data-icon="inline-start" aria-hidden="true" />
                Hide
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => demoAction("Publishing reviews")}>
                <Eye data-icon="inline-start" aria-hidden="true" />
                Publish
              </Button>
            )}
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  );
}

export function ReviewsView() {
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const visible = REVIEWS.filter(
    (review) =>
      (!status || review.status === status) &&
      (!term || review.product.toLowerCase().includes(term) || review.customer.toLowerCase().includes(term)),
  );

  return (
    <AdminPage
      demo
      eyebrow="Marketing"
      title="Reviews"
      description="What customers say about products. Reviews aren't collected yet, so these are samples and moderation isn't saved."
    >
      <Grid align="start" gap="6" className={cn("lg:grid-cols-3")}>
        <RatingSummary />
        <Stack gap="4" className={cn("min-w-0 lg:col-span-2")}>
          <Flex wrap align="center" gap="3">
            <ChipGroup aria-label="Filter reviews by status" options={STATUS_OPTIONS} value={status} onValueChange={setStatus} />
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder="Product or customer…"
              aria-label="Search reviews"
              className={cn("md:ml-auto md:max-w-60")}
            />
          </Flex>
          {visible.length === 0 ? (
            <Box className={cn("rounded-2xl border border-dashed")}>
              <EmptyState icon={<Star aria-hidden="true" />} title="No reviews match" message="Try another status or search." />
            </Box>
          ) : (
            visible.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </Stack>
      </Grid>
    </AdminPage>
  );
}
