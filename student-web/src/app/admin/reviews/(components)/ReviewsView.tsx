"use client";

import { Check, CornerDownRight, Eye, EyeOff, MessageSquareReply, Star } from "lucide-react";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { demoAction } from "@/components/admin/demo";
import { RowActionsMenu, type RowAction } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StarRating } from "@/components/shared/StarRating";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { REVIEW_STATUSES, REVIEWS, type AdminReview, type ReviewStatus } from "@/data/admin";
import { useClientPages } from "@/hooks/useClientPages";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STATUS_TONES: Record<ReviewStatus, StatusTone> = {
  Pending: "warning",
  Published: "success",
  Hidden: "neutral",
};

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  ...REVIEW_STATUSES.map((status) => ({ value: status, label: status })),
];

const RATING_OPTIONS = [
  { value: ALL, label: "All ratings" },
  ...[5, 4, 3, 2, 1].map((rating) => ({ value: String(rating), label: `${rating} star${rating > 1 ? "s" : ""}` })),
];

/** Moderation menu — sirf woh actions jo is status par samajh aate hain */
function reviewActions(review: AdminReview): RowAction[] {
  const actions: RowAction[] = [];
  if (review.status === "Pending") {
    actions.push({ label: "Approve", icon: Check, onSelect: () => demoAction("Approving reviews") });
  }
  if (review.status === "Hidden") {
    actions.push({ label: "Publish", icon: Eye, onSelect: () => demoAction("Publishing reviews") });
  }
  actions.push({
    label: review.replied ? "Edit reply" : "Reply",
    icon: MessageSquareReply,
    onSelect: () => demoAction("Replying to reviews"),
  });
  if (review.status !== "Hidden") {
    actions.push({ label: "Hide", icon: EyeOff, destructive: true, onSelect: () => demoAction("Hiding reviews") });
  }
  return actions;
}

export function ReviewsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [rating, setRating] = useState(ALL);

  const term = search.trim().toLowerCase();
  const rows = REVIEWS.filter(
    (review) =>
      (status === ALL || review.status === status) &&
      (rating === ALL || review.rating === Number(rating)) &&
      (!term || review.product.toLowerCase().includes(term) || review.customer.toLowerCase().includes(term)),
  );
  const { currentPage, totalPages, setPage, pageRows } = useClientPages(rows, PAGE_SIZE);
  const pendingCount = REVIEWS.filter((review) => review.status === "Pending").length;

  const filterBy = (setter: (value: string) => void) => (value: string | null) => {
    setter(value ?? ALL);
    setPage(1);
  };

  return (
    <AdminPage
      demo
      title="Reviews"
      description={
        <>
          Product reviews from customers.{" "}
          {pendingCount > 0 && (
            <span className="font-semibold text-foreground">{pendingCount} waiting for approval. </span>
          )}
          Reviews aren&apos;t collected yet, so changes here aren&apos;t saved.
        </>
      }
    >
      <DataTableCard
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Product or customer…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="review-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={status}
                onValueChange={filterBy(setStatus)}
                containerClassName="w-36"
              />
              <SelectField
                id="review-rating-filter"
                aria-label="Filter by rating"
                size="sm"
                options={RATING_OPTIONS}
                value={rating}
                onValueChange={filterBy(setRating)}
                containerClassName="w-32"
              />
            </ToolbarFilters>
          </>
        }
        footer={
          rows.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={rows.length}
              limit={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="reviews"
            />
          ) : undefined
        }
      >
        {rows.length === 0 ? (
          <EmptyState icon={<Star aria-hidden="true" />} title="No reviews match" message="Try another rating or status." />
        ) : (
          <Table className="min-w-220">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((review) => (
                <TableRow key={review.id} className="align-top">
                  <TableCell className="w-64">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        name={review.product}
                        categoryName={review.category}
                        sizes="44px"
                        className="size-11 shrink-0 rounded-lg ring-1 ring-border"
                        imageClassName="p-1"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{review.product}</p>
                        <p className="text-xs text-muted-foreground">{review.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="flex max-w-xl flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {review.customer} · {review.date}
                        </span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      {review.replied && (
                        <p className="flex items-center gap-1 text-xs font-medium text-brand">
                          <CornerDownRight className="size-3.5" aria-hidden="true" />
                          You replied
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={review.status} tone={STATUS_TONES[review.status]} />
                  </TableCell>
                  <TableCell>
                    <RowActionsMenu label={`review of ${review.product} by ${review.customer}`} actions={reviewActions(review)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTableCard>
    </AdminPage>
  );
}
