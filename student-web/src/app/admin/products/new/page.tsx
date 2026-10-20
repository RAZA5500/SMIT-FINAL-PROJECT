"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import AdminFormPage, {
  FORM_INPUT_CLASS,
  FORM_LABEL_CLASS,
  FORM_SELECT_CLASS,
  FORM_TEXTAREA_CLASS,
  RequiredMark,
} from "@/components/admin/AdminFormPage";

const STEPS = ["Basic", "Price", "Inventory", "Media", "Review"] as const;

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`inline-flex relative border-2 border-transparent rounded-full w-11 h-6 transition-colors duration-200 cursor-pointer shrink-0 ${
        on ? "bg-brand-green" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block bg-white shadow rounded-full w-5 h-5 transition-transform duration-200 pointer-events-none transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function CreateProductPage() {
  const [step, setStep] = useState<(typeof STEPS)[number]>("Basic");
  const [active, setActive] = useState(true);

  return (
    <AdminFormPage submitLabel="Next" cancelHref="/admin/products">
      <div className="flex items-center border-gray-100 border-b -mx-4 sm:-mx-6 px-4 sm:px-6">
        {STEPS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`flex-1 pb-3 text-sm font-medium transition-colors cursor-pointer border-b-2 ${
              step === s
                ? "border-brand-green text-brand-green"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="gap-4 grid sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 w-full">
          <label className={FORM_LABEL_CLASS} htmlFor="productName">
            Product Name
            <RequiredMark />
          </label>
          <input id="productName" className={FORM_INPUT_CLASS} placeholder="Enter product name" />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className={FORM_LABEL_CLASS} htmlFor="productCategory">
            Category
            <RequiredMark />
          </label>
          <button id="productCategory" type="button" className={FORM_SELECT_CLASS}>
            <span className="line-clamp-1 text-gray-400">Select Category</span>
            <ChevronDown className="pointer-events-none size-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className={FORM_LABEL_CLASS} htmlFor="productBrand">
            Brand Name
          </label>
          <button id="productBrand" type="button" className={FORM_SELECT_CLASS}>
            <span className="line-clamp-1 text-gray-400">No information</span>
            <ChevronDown className="pointer-events-none size-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className={FORM_LABEL_CLASS} htmlFor="productOrigin">
            Country of Origin
          </label>
          <button id="productOrigin" type="button" className={FORM_SELECT_CLASS}>
            <span className="line-clamp-1 text-gray-400">Select Country of Origin</span>
            <ChevronDown className="pointer-events-none size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className={FORM_LABEL_CLASS} htmlFor="productShort">
          Short Description
        </label>
        <textarea
          id="productShort"
          className={`${FORM_TEXTAREA_CLASS} min-h-16`}
          placeholder="Enter short product description"
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className={FORM_LABEL_CLASS} htmlFor="productDescription">
          Description
        </label>
        <textarea
          id="productDescription"
          className={FORM_TEXTAREA_CLASS}
          placeholder="Enter product description"
        />
      </div>

      <div className="flex justify-between items-center gap-4 px-4 py-3 border border-border-card rounded-15">
        <label className={FORM_LABEL_CLASS}>Active</label>
        <Toggle on={active} onToggle={() => setActive((v) => !v)} />
      </div>
    </AdminFormPage>
  );
}
