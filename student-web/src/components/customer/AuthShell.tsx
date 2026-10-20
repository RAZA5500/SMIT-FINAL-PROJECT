import type { ReactNode } from "react";
import { AuthBackground } from "./auth-chrome";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** /login aur /register ka frame — background, white card, footer */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-6">
        <AuthBackground />
        <div className="relative z-10 flex w-full max-w-auth-container flex-col">
          <div className="flex w-full flex-col items-center gap-4 px-4 lg:mx-auto lg:w-118 lg:px-0">
            <div className="w-full rounded-2xl border border-border-light bg-white px-6 py-4 shadow-lg md:px-10 md:py-5">
              <div className="mb-4 text-left md:mb-8">
                <h1 className="font-inter text-xl leading-9 font-semibold text-gray-dark md:text-fs-26">
                  {title}
                </h1>
                <p className="pt-2 font-inter text-sm leading-6 font-normal text-gray-medium">
                  {subtitle}
                </p>
              </div>
              {children}
            </div>
            <p className="mt-3 text-center font-inter text-sm leading-5 font-normal text-ink">
              © 2026 FreshStock. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
