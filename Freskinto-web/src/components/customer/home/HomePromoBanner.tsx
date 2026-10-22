"use client";

import { ArrowRight, Check, Copy, Tag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { publicRoutes } from "@/lib/routes/routes";
import { toastSuccess } from "@/lib/toast";

const PROMO_CODE = "FRESH10";

export function HomePromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      toastSuccess("Voucher copied to clipboard!", "Use code FRESH10 at checkout for £10 off.");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toastSuccess("Promo code: FRESH10", "Apply at checkout for £10 discount.");
    }
  };

  return (
    <section aria-labelledby="promo-heading" className="relative isolate overflow-hidden rounded-3xl bg-brand-green-forest p-8 text-white sm:p-12">
      <div aria-hidden="true" className="texture-dots absolute inset-0 -z-10 text-white/5" />
      <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-brand-green/20 blur-3xl pointer-events-none" />

      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-fs-12 font-bold tracking-wider text-emerald-300 uppercase">
              <Tag aria-hidden="true" className="size-3.5" />
              Welcome Offer
            </span>
          </div>

          <h2 id="promo-heading" className="font-heading text-fs-32 font-bold leading-tight drop-shadow-sm sm:text-fs-42">
            Get £10 off your first neighbourhood shop.
          </h2>

          <p className="max-w-xl text-base text-white/80">
            Taste the difference of true market freshness. Enter your promo code at checkout on any basket — no minimum order requirement!
          </p>

          <ul className="flex flex-wrap gap-4 pt-1 text-fs-13 text-white/80">
            <li className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> Free delivery included
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> Click &amp; collect available
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> Farm-to-table freshness
            </li>
          </ul>
        </div>

        {/* Right Column: Voucher Card & Interaction */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <span className="text-center text-fs-12 font-bold tracking-widest text-emerald-300 uppercase">
              Use code at checkout
            </span>

            {/* Interactive Copyable Voucher Box */}
            <div className="flex items-center justify-between rounded-xl border border-dashed border-white/40 bg-white/10 p-2.5">
              <div className="flex items-center gap-2 pl-2">
                <Tag className="size-4 text-emerald-400" />
                <span className="font-mono text-fs-20 font-extrabold tracking-widest text-white">
                  {PROMO_CODE}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 rounded-lg bg-white text-brand-green-forest hover:bg-emerald-50 font-bold"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>

            <ButtonLink
              href={publicRoutes.shop}
              variant="cta"
              size="lg"
              className="w-full justify-center rounded-xl bg-white text-brand-green-forest hover:bg-emerald-50 hover:text-brand-green-forest font-bold shadow-lift"
            >
              <span>Start shopping now</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
