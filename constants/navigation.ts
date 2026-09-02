import { Platform } from "react-native";
import type { Href } from "expo-router";

export const USE_NATIVE_HEADER = Platform.OS !== "web";

/** Web: top links on wide screens, burger menu below this width. Native is unchanged. */
export const WEB_NAV_BREAKPOINT = 768;

export const WEB_NAV_ITEMS = [
  { href: "/" as Href, label: "Events", icon: "trophy-outline" as const },
  { href: "/ranking" as Href, label: "Rankings", icon: "podium-outline" as const },
  { href: "/more" as Href, label: "More", icon: "options-outline" as const },
] as const;
