import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * On web, a hard refresh on a stack screen leaves no history entry to go back to.
 * Seed "/" behind the current URL so the browser back button returns home.
 */
export function useWebHistoryFallback() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return;
    }

    if (router.canGoBack()) {
      return;
    }

    const fullPath =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    window.history.replaceState(window.history.state, "", "/");
    window.history.pushState(window.history.state, "", fullPath);
  }, [router]);
}
