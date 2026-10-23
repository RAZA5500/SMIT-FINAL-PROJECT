"use client";

import { useEffect } from "react";
import { Aurora } from "@/components/ui/aurora";
import { Stack } from "@/components/ui/flex";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ErrorState } from "@/components/shared/ErrorState";
import { Logo } from "@/components/shared/Logo";
import { publicRoutes } from "@/lib/routes/routes";

/** Route-level error boundary (Next 16: `unstable_retry` segment dobara fetch + render karta hai) */
export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack as="main" id="content" align="center" justify="center" gap="8" className="relative isolate min-h-dvh flex-1 px-6 py-16">
      <Aurora />
      <Logo size="md" />
      <ErrorState
        title="Something went wrong"
        message="An unexpected error stopped this page from loading. Try again, or head back to the shop."
        onRetry={unstable_retry}
        className="max-w-xl"
      />
      <ButtonLink href={publicRoutes.shop} variant="outline">
        Back to the shop
      </ButtonLink>
    </Stack>
  );
}
