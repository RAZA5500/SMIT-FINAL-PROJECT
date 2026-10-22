import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Server aur hydration render par `false`, us ke baad `true`.
 * Suspense ke andar wale components der se hydrate hote hain — tab tak doosra component
 * (e.g. footer) wahi query cache mein la chuka hota hai, aur data wala client render server
 * ke skeleton se match nahi karta. Pehle render ko server jaisa rakhne ke liye yeh flag.
 * Client-side navigation par shuru se `true` hota hai (koi skeleton flash nahi).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
