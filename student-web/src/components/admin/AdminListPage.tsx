"use client";

import Link from "next/link";
import React from "react";
import { ChevronDown, Funnel, Plus, Search } from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";

/* Shell shared by every admin list screen: white card, sticky toolbar,
   scrolling table area and a pagination footer. */

export const ADMIN_SEARCH_INPUT_CLASS =
  "w-full min-w-0 rounded-md border px-2 py-0.5 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30 pl-9 text-sm border-gray-200 rounded-15! bg-transparent placeholder:text-gray-400 h-12 focus:border-brand-green focus:ring-2 focus:ring-brand-green/30";

export const ADMIN_PRIMARY_BUTTON_CLASS =
  "group/button inline-flex items-center justify-center rounded-5 border border-transparent bg-clip-padding font-medium whitespace-nowrap duration-200 outline-none select-none disabled:pointer-events-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-cta-green text-white hover:opacity-90 hover:translate-y-0 transition-opacity disabled:opacity-50 gap-1 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 px-5 rounded-15 h-12 text-sm shrink-0";

export const ADMIN_FILTER_BUTTON_CLASS =
  "flex items-center justify-between rounded-15 border border-input bg-input/20 px-2 py-1.5 text-sm md:text-xs/relaxed whitespace-nowrap outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 h-12! rounded-15! border! bg-white! hover:bg-white! px-5! text-sm! text-gray-700! shadow-btn gap-2 hover:translate-y-0 cursor-pointer relative overflow-hidden transition-[border-color] duration-150 w-auto shrink-0 border-gray-300! hover:border-brand-green!";

const BADGE_CLASS =
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full border py-0.5 whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5! [a]:hover:bg-primary/80 gap-1 font-light text-xs h-7 px-3 bg-green-50 text-green-700 border-transparent";

const SEARCH_WRAPPER = {
  flex: "relative flex-1 min-w-0",
  capped: "relative w-full max-w-search min-w-0",
  mobile: "relative flex-1",
} as const;

export const TH_CLASS = "px-3 py-4 font-semibold text-muted-green text-sm normal-case text-left";
export const TH_CENTER_CLASS = "px-3 py-4 font-semibold text-muted-green text-sm normal-case text-center";
export const TR_CLASS = "hover:bg-gray-50 border-table-row-border border-b transition-colors cursor-pointer";
/** Live tables: row khud clickable nahi (actions menu / links se kaam) */
export const TR_STATIC_CLASS = "hover:bg-gray-50 border-table-row-border border-b transition-colors";
export const TD_CLASS = "px-3 py-3 text-sm text-gray-700";
/** Shared SearchInput / SelectField ko admin toolbar ka look (h-12, shadow-btn) */
export const ADMIN_SEARCH_FIELD_CLASS = "h-12 border-gray-200 focus-visible:border-brand-green";
export const ADMIN_FILTER_FIELD_CLASS = "h-12 min-w-40 border-gray-300 shadow-btn";

export function AdminSearch({
  value,
  onChange,
  placeholder,
  variant = "flex",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  variant?: "flex" | "capped" | "mobile";
}) {
  return (
    <div className={SEARCH_WRAPPER[variant]}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        data-slot="input"
        className={ADMIN_SEARCH_INPUT_CLASS}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function PrimaryAction({
  label,
  onClick,
  href,
  pushRight,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  pushRight?: boolean;
}) {
  const className = pushRight
    ? ADMIN_PRIMARY_BUTTON_CLASS.replace(" px-5 rounded-15", " ml-auto px-5 rounded-15")
    : ADMIN_PRIMARY_BUTTON_CLASS;
  const content = (
    <>
      <Plus className="mr-1.5 w-4 h-4" />
      {label}
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

/** Production renders these filters as select triggers, not plain buttons. */
export function FilterSelect({ label }: { label: string }) {
  return (
    <>
      <button type="button" data-slot="select-trigger" data-size="default" className={ADMIN_FILTER_BUTTON_CLASS}>
        {/* The invisible copy sizes the trigger; the absolute one is what you read. */}
        <span className="text-sm invisible whitespace-nowrap">{label}</span>
        <span className="text-sm text-gray-700 truncate absolute left-5 right-8 inset-y-0 flex items-center">
          {label}
        </span>
        <ChevronDown className="pointer-events-none size-3.5 text-muted-foreground" />
      </button>
      <input type="hidden" />
    </>
  );
}

export function FilterIcon() {
  return (
    <span className="inline-flex relative shrink-0">
      <Funnel size={20} className="text-icon-muted" />
    </span>
  );
}

export const ADMIN_TOGGLE_BUTTON_CLASS =
  "shadow-btn px-5 border rounded-15 h-12 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer border-gray-300 text-gray-700 bg-white hover:border-brand-green hover:text-brand-green";

export function StatusBadge({ label = "ACTIVE" }: { label?: string }) {
  return (
    <span data-slot="badge" className={BADGE_CLASS}>
      <span className="rounded-full w-1.5 h-1.5 bg-brand-green" />
      {label}
    </span>
  );
}

const ROW_ACTION_BUTTON = {
  bare: "p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer",
  solid: "p-1.5 rounded-5 bg-actions-btn text-white hover:opacity-80 transition-opacity cursor-pointer",
  chip: "inline-flex items-center justify-center w-8 h-8 rounded-lg border-0 transition-colors cursor-pointer bg-actions-btn",
} as const;

export function RowActions({
  onClick,
  variant = "bare",
}: {
  onClick?: () => void;
  variant?: "bare" | "solid" | "chip";
}) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        data-slot="dropdown-menu-trigger"
        onClick={onClick}
        className={ROW_ACTION_BUTTON[variant]}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={variant === "chip" ? "lucide lucide-ellipsis-vertical text-white" : "lucide lucide-ellipsis-vertical"}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>
  );
}

export default function AdminListPage({
  toolbar,
  toolbarClassName = "hidden lg:flex flex-col gap-2",
  mobileToolbar,
  responsiveToolbar = false,
  children,
  total,
  page,
  pageSize,
  onPageChange,
  noun,
}: {
  toolbar: React.ReactNode;
  /** Production uses a single row on most screens; a few stack two rows. */
  toolbarClassName?: string;
  mobileToolbar?: React.ReactNode;
  /** Live screens: toolbar ek hi dafa render (form ids duplicate nahi), chhoti screen par wrap */
  responsiveToolbar?: boolean;
  children: React.ReactNode;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  noun: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 sm:px-4 sm:py-5 overflow-y-auto lg:overflow-hidden">
      <div className="flex flex-col flex-1 bg-white shadow-card sm:rounded-xl min-h-0">
        <div className="px-5 pt-4 pb-2 shrink-0">
          {responsiveToolbar ? (
            <div className="flex flex-wrap items-center gap-3">{toolbar}</div>
          ) : (
            <>
              <div className={toolbarClassName}>{toolbar}</div>
              <div className="lg:hidden flex flex-col gap-3">{mobileToolbar ?? toolbar}</div>
            </>
          )}
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="shadow-card m-5 border-table rounded-5 overflow-hidden overflow-x-auto">{children}</div>
          </div>

          {/* Production hides the footer entirely when nothing matches (Pagination total 0 par null). */}
          {total > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-pagination-bg rounded-b-xl">
              <Pagination
                currentPage={page}
                totalPages={pageCount}
                total={total}
                limit={pageSize}
                onPageChange={onPageChange}
                itemLabel={noun}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
