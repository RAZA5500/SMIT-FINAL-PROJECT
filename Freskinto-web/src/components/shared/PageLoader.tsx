import { LogoMark } from "./Logo";

/** Poore page ka loading (AuthGuard role verify kar raha ho) */
export function PageLoader() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4"
    >
      <LogoMark size="lg" className="animate-pulse" />
      <p aria-hidden="true" className="kicker text-muted-foreground">
        Opening the market…
      </p>
    </div>
  );
}
