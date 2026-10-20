"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Calendar, ChevronDown, EllipsisVertical, Search } from "lucide-react";
import { ADMIN_SEARCH_INPUT_CLASS, PrimaryAction } from "@/components/admin/AdminListPage";

type PromoStatus = "Active" | "Inactive" | "Expired";

interface AdminPromotion {
  title: string;
  blurb: string;
  product?: string;
  from: string;
  to: string;
  media: "Image" | "Video" | null;
  mediaSrc?: string;
  status: PromoStatus;
}

const CDN = "/media/promotions";

const PROMOTIONS: AdminPromotion[] = [
  { title: "Mutahir Sale", blurb: "Get up to 100% off on fresh produce", from: "Jun 01, 2026", to: "Sep 01, 2026", media: null, status: "Expired" },
  { title: "Summer Sale", blurb: "Get up to 100% off on fresh produce", from: "Jun 01, 2026", to: "Sep 01, 2026", media: null, status: "Expired" },
  { title: "ABCD", blurb: "abcdabcdabcdabcdabcd", product: "Milk Pack", from: "Sep 07, 2026", to: "Sep 10, 2026", media: null, status: "Expired" },
  { title: "test 11111", blurb: "test 1 test 1 test 1 test 1 test 1 test 1 test 1 test 1 test 11111", from: "Sep 01, 2026", to: "Sep 01, 2026", media: "Image", mediaSrc: `${CDN}/thumbnails/8630114b.jpg`, status: "Expired" },
  {
    title: "Snack Time Special",
    blurb: "Make snack time better with special offers on potato chips, roasted peanuts, cheese crackers, and other tasty bites.",
    product: "Classic Potato Chips",
    from: "Sep 01, 2026",
    to: "Sep 30, 2026",
    media: "Image",
    mediaSrc: `${CDN}/thumbnails/a65b0000.jpg`,
    status: "Inactive",
  },
  {
    title: "Frozen Food Favorites",
    blurb: "Get great deals on frozen chicken nuggets, French fries, vegetable samosas, and other convenient frozen foods.",
    product: "Frozen Vegetable Samosas",
    from: "Sep 01, 2026",
    to: "Sep 30, 2026",
    media: "Image",
    mediaSrc: `${CDN}/thumbnails/0f678910.jpg`,
    status: "Active",
  },
  {
    title: "Meat & Chicken Savings",
    blurb: "Stock up on premium beef steaks, minced beef, chicken breast, thighs, and wings with exclusive savings.",
    product: "Chicken Wings",
    from: "Sep 01, 2026",
    to: "Sep 30, 2026",
    media: "Image",
    mediaSrc: `${CDN}/thumbnails/304289c5.jpg`,
    status: "Active",
  },
  {
    title: "Bakery Treats Sale",
    blurb: "Treat yourself to delicious cakes, croissants, muffins, and fresh whole wheat bread at special promotional prices.",
    product: "Whole Wheat Bread Loaf",
    from: "Sep 01, 2026",
    to: "Oct 03, 2026",
    media: "Video",
    mediaSrc: `${CDN}/videos/49469308.mp4`,
    status: "Active",
  },
  {
    title: "Dairy & Cheese Deals",
    blurb: "Save on fresh milk, mature cheddar, mozzarella, and other dairy favorites for your everyday meals.",
    product: "Mature Cheddar Cheese",
    from: "Sep 01, 2026",
    to: "Sep 10, 2026",
    media: "Image",
    mediaSrc: `${CDN}/thumbnails/5e15bff5.jpg`,
    status: "Expired",
  },
  {
    title: "Fresh Produce Weekend",
    blurb: "Enjoy special savings on fresh apples, bananas, strawberries, broccoli, carrots, and bell peppers all weekend long.",
    product: "Fresh Bell Peppers",
    from: "Sep 01, 2026",
    to: "Sep 03, 2026",
    media: "Image",
    mediaSrc: `${CDN}/thumbnails/66045d24.jpg`,
    status: "Expired",
  },
];

const STATUS_TONE: Record<PromoStatus, string> = {
  Active: "bg-promo-active text-promo-active",
  Inactive: "bg-promo-scheduled text-promo-scheduled",
  Expired: "bg-promo-expired text-promo-expired",
};

const SECONDARY_BUTTON =
  "inline-flex items-center justify-between gap-2 h-11 px-4 rounded-15 border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer";

export default function AdminPromotionsPage() {
  const [search, setSearch] = useState("");

  const promos = useMemo(() => {
    const term = search.trim().toLowerCase();
    return PROMOTIONS.filter((p) => !term || p.title.toLowerCase().includes(term));
  }, [search]);

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 sm:px-4 sm:py-5 overflow-y-auto lg:overflow-hidden">
      <div className="flex flex-col flex-1 bg-white shadow-card sm:rounded-xl min-h-0">
        <div className="px-5 pt-4 pb-2 shrink-0">
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative w-full max-w-search min-w-0">
              <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              <input
                data-slot="input"
                className={ADMIN_SEARCH_INPUT_CLASS}
                placeholder="Search by promotion title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="button" className={SECONDARY_BUTTON}>
              All Status
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>
            <button type="button" className={SECONDARY_BUTTON}>
              Media
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>
            <div className="ml-auto">
              <PrimaryAction label="Create Promotion" />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="gap-4 grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {promos.map((p) => (
              <div
                key={p.title}
                className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden w-full max-w-75 mx-auto min-[500px]:mx-0"
              >
                <div className="relative w-full h-41 bg-gray-100">
                  {p.mediaSrc && p.media === "Video" ? (
                    <video className="absolute inset-0 w-full h-full object-cover" src={p.mediaSrc} muted loop />
                  ) : p.mediaSrc ? (
                    <Image alt="" fill sizes="300px" className="object-cover" src={p.mediaSrc} />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
                      No media
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_TONE[p.status]}`}
                  >
                    {p.status}
                  </span>
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      className="flex items-center justify-center w-5 h-5 rounded-5 bg-actions-btn hover:opacity-90 text-gray-700 transition-opacity shadow-sm cursor-pointer"
                    >
                      <EllipsisVertical className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{p.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.blurb}</p>
                  {p.product && (
                    <p className="text-xs text-gray-700 mt-1">
                      <span className="font-medium">Product: </span>
                      {p.product}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 min-w-0">
                      <Calendar className="lucide lucide-calendar text-gray-500 shrink-0 w-3 h-3" />
                      <span className="truncate">
                        {p.from} - {p.to}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-700 shrink-0">
                      {p.media ?? "Image"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-pagination-bg rounded-b-xl">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">1-{promos.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{promos.length}</span> promotions
          </p>
        </div>
      </div>
    </main>
  );
}
