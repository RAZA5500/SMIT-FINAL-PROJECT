import { LoaderCircle } from "lucide-react";

/** Poore page ka loading (AuthGuard role verify kar raha ho) */
export function PageLoader() {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center" aria-busy="true" aria-label="Loading">
      <LoaderCircle className="size-10 animate-spin text-brand-green" aria-hidden="true" />
    </div>
  );
}
