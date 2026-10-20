"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CONTACT_EMAIL = "info@freshes.com";

/* The three social glyphs are inlined so they keep the exact stroke geometry
   the production build ships. */
function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white group-hover:text-brand-green-light transition-colors duration-200"
    >
      <path
        d="M15.0007 1.66699H12.5007C11.3956 1.66699 10.3358 2.10598 9.55437 2.88738C8.77297 3.66878 8.33398 4.72859 8.33398 5.83366V8.33366H5.83398V11.667H8.33398V18.3337H11.6673V11.667H14.1673L15.0007 8.33366H11.6673V5.83366C11.6673 5.61265 11.7551 5.40068 11.9114 5.2444C12.0677 5.08812 12.2796 5.00033 12.5007 5.00033H15.0007V1.66699Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white group-hover:text-brand-green-light transition-colors duration-200"
    >
      <path
        d="M18.3327 3.33368C18.3327 3.33368 17.7493 5.08368 16.666 6.16701C17.9993 14.5003 8.83268 20.5837 1.66602 15.8337C3.49935 15.917 5.33268 15.3337 6.66602 14.167C2.49935 12.917 0.416016 8.00034 2.49935 4.16701C4.33268 6.33368 7.16602 7.58368 9.99935 7.50034C9.24935 4.00034 13.3327 2.00034 15.8327 4.33368C16.7493 4.33368 18.3327 3.33368 18.3327 3.33368Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white group-hover:text-brand-green-light transition-colors duration-200"
    >
      <path
        d="M14.166 1.66699H5.83268C3.5315 1.66699 1.66602 3.53247 1.66602 5.83366V14.167C1.66602 16.4682 3.5315 18.3337 5.83268 18.3337H14.166C16.4672 18.3337 18.3327 16.4682 18.3327 14.167V5.83366C18.3327 3.53247 16.4672 1.66699 14.166 1.66699Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3337 9.47525C13.4366 10.1688 13.3181 10.8771 12.9952 11.4994C12.6723 12.1218 12.1614 12.6264 11.5351 12.9416C10.9088 13.2569 10.1991 13.3666 9.5069 13.2552C8.81468 13.1438 8.17521 12.817 7.67944 12.3212C7.18367 11.8255 6.85685 11.186 6.74546 10.4938C6.63408 9.80154 6.74379 9.09183 7.05901 8.46556C7.37423 7.8393 7.8789 7.32837 8.50123 7.00545C9.12356 6.68254 9.83187 6.56407 10.5254 6.66692C11.2328 6.77182 11.8878 7.10147 12.3935 7.60717C12.8992 8.11288 13.2288 8.76782 13.3337 9.47525Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.584 5.41699H14.5923"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-map-pin ${className}`}
      aria-hidden="true"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-phone ${className}`}
      aria-hidden="true"
    >
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function MailIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-mail ${className}`}
      aria-hidden="true"
    >
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function SocialLinks() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="group inline-flex justify-center items-center bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-200 cursor-pointer">
        <FacebookIcon />
      </div>
      <div className="group inline-flex justify-center items-center bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-200 cursor-pointer">
        <TwitterIcon />
      </div>
      <div className="group inline-flex justify-center items-center bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-200 cursor-pointer">
        <InstagramIcon />
      </div>
    </div>
  );
}

const QUICK_LINKS = [
  { label: "About Us", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/" },
  { label: "Blog", href: "/" },
];

const SERVICE_LINKS = [
  { label: "My Account", href: "/" },
  { label: "Order History", href: "/" },
  { label: "Addresses", href: "/" },
];

export default function SiteFooter() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="bg-footer-brand text-white text-sm">
      {/* ---------------------------------------------------------------- */}
      {/* Compact stack, below lg                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="lg:hidden flex flex-col items-start pt-15 header-container">
        <Link className="inline-flex items-center" aria-label="Freshes home" href="/">
          <Image
            alt="Freshes"
            width={113}
            height={50}
            className="w-28 h-12 object-contain"
            src="/branding/logo-footer.svg"
          />
        </Link>

        <div className="flex items-center gap-2.5 mt-4">
          <div className="group inline-flex justify-center items-center bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-200 cursor-pointer">
            <FacebookIcon />
          </div>
          <div className="group inline-flex justify-center items-center bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-200 cursor-pointer">
            <TwitterIcon />
          </div>
          <div className="group inline-flex justify-center items-center bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-200 cursor-pointer">
            <InstagramIcon />
          </div>
        </div>

        <nav className="mt-6" aria-label="Footer">
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-3">
            <div className="flex flex-col">
              <div className="font-inter font-medium text-white text-xs leading-normal">Quick Links</div>
              <div className="flex flex-col gap-2 mt-2">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    className="font-inter font-normal text-3xs text-white/80 hover:text-white leading-normal transition-colors duration-200"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="font-inter font-medium text-white text-xs leading-normal">Customer Service</div>
              <div className="flex flex-col gap-2 mt-2">
                {SERVICE_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    className="font-inter font-normal text-3xs text-white/80 hover:text-white leading-normal transition-colors duration-200"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="font-inter font-medium text-white text-xs leading-normal">Contact Us</div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="mt-0.5 w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span className="font-inter font-normal text-3xs text-gray-400 leading-normal">
                    123 Fresh Street, London, UK 10001
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span className="font-inter font-normal text-3xs text-gray-400 leading-normal">
                    +4 (47) 123-4567
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span className="font-inter font-normal text-3xs text-gray-400 leading-normal">
                    {CONTACT_EMAIL}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-10 w-full">
          <hr className="bg-body-text border-0 w-full h-px" />
        </div>
        <div className="py-6">
          <div className="font-inter font-normal text-white/80 text-sm leading-normal">
            Freshes © 2026. All Rights Reserved
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Full layout, lg and up                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="hidden lg:flex items-start gap-8 py-15 gap header-container">
        <div className="flex flex-col">
          <Link className="inline-flex relative items-center shrink-0" aria-label="Freshes home" href="/">
            <Image
              alt="Freshes"
              width={156}
              height={38}
              className="w-footer-logo h-footer-logo object-contain object-left"
              src="/branding/logo-footer.svg"
            />
          </Link>
          <div className="flex flex-col gap-4 mt-4">
            <p className="max-w-72 text-white/80">
              Your trusted source for fresh, organic, and healthy food products delivered right to your door.
            </p>
            <SocialLinks />
          </div>
        </div>

        <nav aria-label="Footer" className="gap-8 grid grid-cols-3">
          <div className="flex flex-col w-72">
            <div className="font-inter font-medium text-white text-base leading-normal">Quick Links</div>
            <div className="flex flex-col gap-3 mt-5">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.label}
                  className="font-inter font-normal text-white/80 hover:text-white text-sm leading-normal transition-colors duration-200"
                  href={l.href}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-72">
            <div className="font-inter font-medium text-white text-base leading-normal">Customer Service</div>
            <div className="flex flex-col gap-3 mt-5">
              {SERVICE_LINKS.map((l) => (
                <Link
                  key={l.label}
                  className="font-inter font-normal text-white/80 hover:text-white text-sm leading-normal transition-colors duration-200"
                  href={l.href}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col max-w-72">
            <div className="font-inter font-medium text-white text-base leading-normal">Contact Us</div>
            <div className="flex flex-col gap-3 mt-5">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 w-4 h-4 text-brand-green shrink-0" />
                <span className="font-inter font-normal text-white/80 text-sm leading-normal">
                  123 Fresh Street, London, UK 10001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneIcon className="w-4 h-4 text-brand-green shrink-0" />
                <span className="font-inter font-normal text-white/80 text-sm leading-normal">
                  +4 (47) 123-4567
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MailIcon className="w-4 h-4 text-brand-green shrink-0" />
                <span className="font-inter font-normal text-white/80 text-sm leading-normal">
                  {CONTACT_EMAIL}
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="hidden lg:block header-container">
        <hr className="bg-body-text border-0 h-px" />
      </div>

      <div className="hidden lg:flex justify-between items-center py-6 header-container">
        <div className="font-inter font-normal text-white/80 text-sm leading-normal">
          © 2026 Freshes. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link
            className="font-inter font-normal text-white/80 hover:text-white text-sm transition-colors duration-200"
            href="/"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-inter font-normal text-white/80 hover:text-white text-sm transition-colors duration-200"
            href="/"
          >
            Terms of Service
          </Link>
          <Link
            className="font-inter font-normal text-white/80 hover:text-white text-sm transition-colors duration-200"
            href="/"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
