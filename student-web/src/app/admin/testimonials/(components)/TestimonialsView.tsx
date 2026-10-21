"use client";

import { Pencil, Plus, Quote, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { SelectField } from "@/components/shared/SelectField";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TESTIMONIALS } from "@/data/testimonials";
import { cn } from "@/lib/utils";

type FeaturedFilter = "ALL" | "FEATURED" | "NOT_FEATURED";

const FILTER_OPTIONS: { value: FeaturedFilter; label: string }[] = [
  { value: "ALL", label: "All testimonials" },
  { value: "FEATURED", label: "On the home page" },
  { value: "NOT_FEATURED", label: "Not shown" },
];

export function TestimonialsView() {
  const [filter, setFilter] = useState<FeaturedFilter>("ALL");
  // Sirf is screen par — reload par sample data wapas
  const [featured, setFeatured] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TESTIMONIALS.map((testimonial) => [testimonial.id, testimonial.featured])),
  );

  const featuredCount = Object.values(featured).filter(Boolean).length;
  const testimonials = TESTIMONIALS.filter(
    (testimonial) => filter === "ALL" || featured[testimonial.id] === (filter === "FEATURED"),
  );

  return (
    <AdminPage
      demo
      title="Testimonials"
      description="Choose which customer quotes appear in “What shoppers say” on the home page. Changes here aren't saved."
      actions={
        <Button onClick={() => demoAction("Adding testimonials")}>
          <Plus aria-hidden="true" />
          Add testimonial
        </Button>
      }
    >
      <DataTableCard
        toolbar={
          <>
            <p className="text-sm text-muted-foreground">
              <span className="numeric font-semibold text-foreground">{featuredCount}</span> of{" "}
              <span className="numeric font-semibold text-foreground">{TESTIMONIALS.length}</span> shown on the home
              page
            </p>
            <ToolbarFilters>
              <SelectField
                id="testimonial-filter"
                aria-label="Filter testimonials"
                size="sm"
                options={FILTER_OPTIONS}
                value={filter}
                onValueChange={(value) => setFilter(value ?? "ALL")}
                containerClassName="w-44"
              />
            </ToolbarFilters>
          </>
        }
      >
        {testimonials.length === 0 ? (
          <EmptyState icon={<Quote aria-hidden="true" />} title="Nothing here" message="Try another filter." />
        ) : (
          <ul className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => {
              const isFeatured = featured[testimonial.id];
              const switchId = `featured-${testimonial.id}`;
              return (
                <li
                  key={testimonial.id}
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl p-5 ring-1 transition-colors",
                    isFeatured ? "bg-card ring-border" : "bg-muted/40 ring-transparent",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.photo}
                        alt=""
                        width={44}
                        height={44}
                        className="size-11 rounded-full object-cover ring-2 ring-lime-soft"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold">{testimonial.customer}</p>
                        <StarRating rating={testimonial.rating} size="sm" />
                      </div>
                    </div>
                    <RowActionsMenu
                      label={`testimonial from ${testimonial.customer}`}
                      actions={[
                        { label: "Edit", icon: Pencil, onSelect: () => demoAction("Editing testimonials") },
                        {
                          label: "Delete",
                          icon: Trash2,
                          destructive: true,
                          onSelect: () => demoAction("Deleting testimonials"),
                        },
                      ]}
                    />
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-foreground/85">
                    “{testimonial.text}”
                  </blockquote>
                  <div className="flex items-center justify-between gap-3 border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      {testimonial.source} · {testimonial.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <label htmlFor={switchId} className="cursor-pointer text-xs font-medium">
                        On home page
                      </label>
                      <Switch
                        id={switchId}
                        checked={isFeatured}
                        onCheckedChange={(checked) => setFeatured((current) => ({ ...current, [testimonial.id]: checked }))}
                      />
                    </div>
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
