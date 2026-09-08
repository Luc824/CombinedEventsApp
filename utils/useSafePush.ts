import { Href, useRouter } from "expo-router";
import { useCallback, useRef } from "react";

/**
 * router.push that ignores rapid repeat taps so the same screen
 * isn't stacked twice on the navigation history.
 */
export function useSafePush(lockMs = 800) {
  const router = useRouter();
  const lockedUntilRef = useRef(0);

  return useCallback(
    (href: Href) => {
      const now = Date.now();
      if (now < lockedUntilRef.current) {
        return;
      }
      lockedUntilRef.current = now + lockMs;
      router.push(href);
    },
    [router, lockMs]
  );
}
