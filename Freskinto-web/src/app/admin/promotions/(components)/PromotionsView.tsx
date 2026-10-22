"use client";

import { CalendarRange, Copy, Megaphone, Pencil, Plus, Power } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { CAMPAIGN_TONES, demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { ChipGroup, type ChipOption } from "@/components/shared/ChipGroup";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CAMPAIGN_STATUSES, PROMOTIONS, type AdminPromotion, type CampaignStatus } from "@/data/admin";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: ChipOption<CampaignStatus | null>[] = [
  { value: null, label: "All", count: PROMOTIONS.length },
  ...CAMPAIGN_STATUSES.map((status) => ({
    value: status,
    label: status,
    count: PROMOTIONS.filter((promotion) => promotion.status === status).length,
  })),
];

function PromotionCard({ promotion }: { promotion: AdminPromotion }) {
  const expired = promotion.status === "Expired";

  return (
    <Card className={cn("pt-0")}>
      <AspectRatio ratio={16 / 9} className={cn("relative overflow-hidden bg-muted")}>
        <Image
          src={promotion.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
          className={cn("object-cover", expired && "opacity-70 grayscale")}
        />
        <Badge variant="tag" className={cn("absolute top-3 left-3 border-transparent bg-background/95 backdrop-blur")}>
          {promotion.placement}
        </Badge>
      </AspectRatio>
      <CardContent className={cn("flex flex-1 flex-col gap-2")}>
        <Heading size="4">{promotion.title}</Heading>
        <Text tone="muted">{promotion.blurb}</Text>
        <Flex align="center" gap="2" className={cn("mt-auto pt-2 text-muted-foreground [&_svg]:size-4")}>
          <CalendarRange aria-hidden="true" />
          <Text as="span" variant="small" numeric>
            {promotion.from} – {promotion.to}
          </Text>
        </Flex>
      </CardContent>
      <CardFooter className={cn("justify-between gap-3 py-3")}>
        <StatusBadge status={promotion.status} tone={CAMPAIGN_TONES[promotion.status]} />
        <RowActionsMenu
          label={promotion.title}
          actions={[
            { label: "Edit", icon: Pencil, onSelect: () => demoAction("Editing promotions") },
            { label: "Duplicate", icon: Copy, onSelect: () => demoAction("Duplicating promotions") },
            {
              label: "End promotion",
              icon: Power,
              destructive: true,
              disabled: expired,
              onSelect: () => demoAction("Ending promotions"),
            },
          ]}
        />
      </CardFooter>
    </Card>
  );
}

export function PromotionsView() {
  const [status, setStatus] = useState<CampaignStatus | null>(null);
  const visible = status ? PROMOTIONS.filter((promotion) => promotion.status === status) : PROMOTIONS;

  return (
    <AdminPage
      demo
      eyebrow="Marketing"
      title="Promotions"
      description="Banners for the home page and shop. The storefront doesn't read promotions yet, so changes here aren't saved."
      actions={
        <Button onClick={() => demoAction("Creating promotions")}>
          <Plus data-icon="inline-start" aria-hidden="true" />
          New promotion
        </Button>
      }
    >
      <Stack gap="5">
        <ChipGroup aria-label="Filter promotions by status" options={STATUS_OPTIONS} value={status} onValueChange={setStatus} />
        {visible.length === 0 ? (
          <Box className={cn("rounded-2xl border border-dashed")}>
            <EmptyState icon={<Megaphone aria-hidden="true" />} title="No promotions here" message="Try another status." />
          </Box>
        ) : (
          <Grid gap="5" className={cn("sm:grid-cols-2 xl:grid-cols-3")}>
            {visible.map((promotion) => (
              <PromotionCard key={promotion.title} promotion={promotion} />
            ))}
          </Grid>
        )}
      </Stack>
    </AdminPage>
  );
}
