"use client";

import { CalendarDays, Copy, Megaphone, MonitorSmartphone, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { CAMPAIGN_TONES, demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { CAMPAIGN_STATUSES, PROMOTIONS } from "@/data/admin";
import { cn } from "@/lib/utils";

const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  ...CAMPAIGN_STATUSES.map((status) => ({ value: status, label: status })),
];

export function PromotionsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);

  const term = search.trim().toLowerCase();
  const promotions = PROMOTIONS.filter(
    (promotion) =>
      (status === ALL || promotion.status === status) && (!term || promotion.title.toLowerCase().includes(term)),
  );

  return (
    <AdminPage
      demo
      title="Promotions"
      description="Banners for the home page and shop. The storefront shows fixed artwork for now, so changes here aren't saved."
      actions={
        <Button onClick={() => demoAction("Creating promotions")}>
          <Plus aria-hidden="true" />
          New promotion
        </Button>
      }
    >
      <DataTableCard
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search promotions…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="promotion-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={status}
                onValueChange={(value) => setStatus(value ?? ALL)}
                containerClassName="w-36"
              />
            </ToolbarFilters>
          </>
        }
        footer={
          promotions.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              <span className="numeric font-semibold text-foreground">{promotions.length}</span> of{" "}
              <span className="numeric font-semibold text-foreground">{PROMOTIONS.length}</span> promotions
            </p>
          ) : undefined
        }
      >
        {promotions.length === 0 ? (
          <EmptyState
            icon={<Megaphone aria-hidden="true" />}
            title="No promotions match"
            message="Try another title or status."
          />
        ) : (
          <ul className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {promotions.map((promotion) => {
              const expired = promotion.status === "Expired";
              return (
                <li
                  key={promotion.title}
                  className="flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-shadow hover:shadow-lift"
                >
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={promotion.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className={cn("object-cover", expired && "opacity-60 grayscale")}
                    />
                    <StatusBadge
                      status={promotion.status}
                      tone={CAMPAIGN_TONES[promotion.status]}
                      className="absolute top-3 left-3 shadow-soft"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-card/90 backdrop-blur">
                      <RowActionsMenu
                        label={promotion.title}
                        actions={[
                          { label: "Edit", icon: Pencil, onSelect: () => demoAction("Editing promotions") },
                          { label: "Duplicate", icon: Copy, onSelect: () => demoAction("Duplicating promotions") },
                          {
                            label: "Delete",
                            icon: Trash2,
                            destructive: true,
                            onSelect: () => demoAction("Deleting promotions"),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-display text-lg font-bold">{promotion.title}</h2>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{promotion.blurb}</p>
                    </div>
                    <dl className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <dt>
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          <span className="sr-only">Runs</span>
                        </dt>
                        <dd>
                          {promotion.from} – {promotion.to}
                        </dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <dt>
                          <MonitorSmartphone className="size-3.5" aria-hidden="true" />
                          <span className="sr-only">Placement</span>
                        </dt>
                        <dd>{promotion.placement}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DataTableCard>
    </AdminPage>
  );
}
