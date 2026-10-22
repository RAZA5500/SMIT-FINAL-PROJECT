"use client";

import { useEffect, useState } from "react";

/** Har `intervalMs` par current time — e.g. payment deadline guzarne par "Pay now" chhupana */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
