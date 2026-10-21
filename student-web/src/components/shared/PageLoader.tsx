import { LogoMark } from "./Logo";

/** Poore page ka loading (AuthGuard role verify kar raha ho) */
export function PageLoader() {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center" aria-busy="true" aria-label="Loading">
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-3xl bg-lime/40" aria-hidden="true" />
        <LogoMark className="relative size-14 drop-shadow-sm" />
      </div>
    </div>
  );
}
