"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import AdminFormPage, {
  FORM_INPUT_CLASS,
  FORM_LABEL_CLASS,
  FORM_SELECT_CLASS,
  FORM_TEXTAREA_CLASS,
  RequiredMark,
  UploadField,
} from "@/components/admin/AdminFormPage";

export default function CreateBrandPage() {
  return (
    <AdminFormPage submitLabel="Create" cancelHref="/admin/brands">
      <div className="gap-4 grid sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 w-full">
          <label className={FORM_LABEL_CLASS} htmlFor="brandName">
            Brand Name
            <RequiredMark />
          </label>
          <div className="relative flex items-center">
            <input id="brandName" className={FORM_INPUT_CLASS} placeholder="Enter brand name" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className={FORM_LABEL_CLASS} htmlFor="ownLabel">
            Own Label
          </label>
          <button id="ownLabel" type="button" className={FORM_SELECT_CLASS}>
            <span className="line-clamp-1">No</span>
            <ChevronDown className="pointer-events-none size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className={FORM_LABEL_CLASS} htmlFor="brandDescription">
          Description
        </label>
        <textarea
          id="brandDescription"
          className={FORM_TEXTAREA_CLASS}
          placeholder="Enter brand description"
        />
      </div>

      <UploadField label="Brand Logo" />
    </AdminFormPage>
  );
}
