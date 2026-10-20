"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Upload } from "lucide-react";

/* Shell shared by the admin "create" screens: white card, scrolling form
   body, and a sticky Cancel / submit footer. */

export const FORM_LABEL_CLASS =
  "flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-sm font-medium text-label";

export const FORM_INPUT_CLASS =
  "w-full min-w-0 rounded-md border px-2 py-0.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed bg-white border-gray-200 h-11 text-xs/relaxed rounded-15! placeholder:text-placeholder placeholder:font-normal";

export const FORM_TEXTAREA_CLASS =
  "flex field-sizing-content rounded-15 border px-2 py-2 transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-200 text-xs/relaxed placeholder:text-placeholder placeholder:font-normal w-full min-h-24";

export const FORM_SELECT_CLASS =
  "flex items-center justify-between gap-2 h-11 w-full max-w-full rounded-15 border border-gray-200 bg-white px-3 text-xs/relaxed text-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:border-green-500 cursor-pointer";

const CANCEL_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border bg-clip-padding whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer hover:opacity-95 active:scale-[0.98] border-border hover:bg-input/50 hover:text-foreground px-6 rounded-15 h-11 font-medium text-sm hover:translate-y-0";

const SUBMIT_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer hover:opacity-90 active:scale-[0.98] bg-brand-green text-white px-6 rounded-15 h-11 font-medium text-sm";

export function RequiredMark() {
  return <span className="ml-0.5 text-red-500">*</span>;
}

export function UploadField({
  label,
  formats = "JPEG / PNG / WEBP",
  maxMb = 10,
  maxFiles = 1,
}: {
  label: string;
  formats?: string;
  maxMb?: number;
  maxFiles?: number;
}) {
  return (
    <div className="space-y-2">
      <label className={`${FORM_LABEL_CLASS} font-medium text-label text-sm`}>
        {label}
        <RequiredMark />
      </label>
      <input className="hidden" type="file" />
      <div className="px-6 py-6 border-2 border-dashed rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring text-center transition-all duration-200 select-none cursor-pointer border-gray-200 hover:border-gray-400 hover:bg-gray-50/50">
        <div className="bg-gray-100 mx-auto mb-4 p-5 rounded-2xl w-fit">
          <ImageIcon className="lucide lucide-image w-10 h-10 text-gray-300" />
        </div>
        <p className="mb-1 font-semibold text-gray-700 text-sm">Drag &amp; drop or click to upload</p>
        <p className="mb-0.5 text-gray-400 text-xs">Upload {formats}</p>
        <p className="mb-5 text-gray-400 text-xs">
          Max size: {maxMb} MB · Up to {maxFiles} file
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-15 border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Choose File
        </button>
      </div>
    </div>
  );
}

export default function AdminFormPage({
  children,
  submitLabel,
  cancelHref,
  formId,
  onSubmit,
  footer,
}: {
  children: React.ReactNode;
  submitLabel?: string;
  cancelHref: string;
  /** Live forms: RHF `handleSubmit` + apna footer (e.g. multi-step Back/Next) */
  formId?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  footer?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 sm:px-4 sm:py-5 overflow-y-auto lg:overflow-hidden min-h-0">
      <div className="bg-white rounded-xl shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <form
          id={formId}
          noValidate={Boolean(onSubmit)}
          className="flex flex-col gap-4 p-4 sm:p-6 flex-1 overflow-y-auto min-h-0"
          onSubmit={onSubmit ?? ((e) => e.preventDefault())}
        >
          {children}
        </form>

        <div className="flex flex-wrap justify-end items-center gap-3 px-6 py-4 border-gray-100 border-t shrink-0">
          {footer ?? (
            <>
              <button type="button" className={CANCEL_BUTTON_CLASS} onClick={() => router.push(cancelHref)}>
                Cancel
              </button>
              <button type="submit" className={SUBMIT_BUTTON_CLASS}>
                {submitLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
