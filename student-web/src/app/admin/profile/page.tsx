"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth-store";

const FIELD_INPUT_CLASS =
  "w-full min-w-0 rounded-md border px-2 py-0.5 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30 bg-white border-gray-200 h-11 text-xs/relaxed rounded-15! placeholder:text-placeholder placeholder:font-normal";

const FIELD_LABEL_CLASS =
  "flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-sm font-medium text-label";

const BUTTON_BASE =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 bg-clip-padding whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-1 rounded-15 px-3 sm:px-5 h-8 sm:h-10 text-xs sm:text-sm font-medium";

export default function AdminProfilePage() {
  const user = useAuthStore((state) => state.user);
  const name = user?.name || "Admin User";
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 sm:px-4 sm:py-5 overflow-y-auto lg:overflow-hidden min-h-0">
      <div className="bg-white rounded-xl shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <form className="flex flex-col flex-1 min-h-0 overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="w-full h-24 sm:h-40 rounded-t-15 bg-hero-gradient shrink-0" />

          <div className="relative px-3 sm:px-6">
            <div className="absolute left-3 sm:left-6 flex items-center justify-center rounded-full bg-hero-gradient text-white font-semibold shrink-0 text-3xl sm:text-5xl w-24 h-24 sm:w-(--profile-avatar-size) sm:h-(--profile-avatar-size) -top-12 sm:-top-(--profile-avatar-half)">
              {initials}
            </div>

            <div className="absolute top-3 right-3 sm:right-6 flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className={`${BUTTON_BASE} border border-gray-200 bg-white text-gray-700 hover:bg-gray-50`}
              >
                Edit Profile
              </button>
              <button
                type="button"
                className={`${BUTTON_BASE} border border-transparent bg-brand-green text-white hover:opacity-90`}
              >
                Change Password
              </button>
            </div>

            <div className="flex items-center profile-details-heading pb-3 sm:pb-4">
              <p className="text-base sm:text-lg font-bold text-body-text">Personal Details</p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 pb-6">
              <div className="gap-4 sm:gap-6 grid sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className={FIELD_LABEL_CLASS} htmlFor="fullName">
                    Full Name
                    <span className="ml-px text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input id="fullName" className={FIELD_INPUT_CLASS} defaultValue={name} disabled />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className={FIELD_LABEL_CLASS} htmlFor="emailAddress">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="emailAddress"
                      className={FIELD_INPUT_CLASS}
                      defaultValue={user?.email || "admin@gmail.com"}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:max-w-1/2">
                <label className={FIELD_LABEL_CLASS} htmlFor="phoneNumber">
                  Phone Number
                </label>
                <div className="relative flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 h-11 px-3 rounded-15 border border-gray-200 bg-white text-xs/relaxed text-gray-600 shrink-0">
                    🇬🇧
                  </span>
                  <input id="phoneNumber" className={FIELD_INPUT_CLASS} defaultValue="+44" disabled />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
