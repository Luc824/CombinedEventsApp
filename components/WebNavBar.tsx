import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WEB_NAV_BREAKPOINT, WEB_NAV_ITEMS } from "../constants/navigation";
import { ThemeColors } from "../constants/ThemeColors";
import { TRACK_COLOR } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname === "" || pathname === "/index";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function WebNavBar() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= WEB_NAV_BREAKPOINT;
  const showFullBrand = width >= 560;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, isDesktop]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          zIndex: 20,
        },
      ]}
    >
      <View style={[styles.bar, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.barInner}>
          <Pressable
            onPress={() => router.navigate("/")}
            accessibilityRole="link"
            accessibilityLabel="Combined Events Points home"
            style={({ hovered, pressed }) => [
              styles.brandButton,
              (hovered || pressed) && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.brand}>
              {showFullBrand ? "Combined Events Points" : "CE Points"}
            </Text>
          </Pressable>

          {isDesktop ? (
            <View style={styles.desktopLinks}>
              {WEB_NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, String(item.href));
                return (
                  <View key={item.label} style={styles.desktopLinkWrap}>
                    <Link href={item.href} asChild>
                      <Pressable
                        accessibilityRole="link"
                        accessibilityState={{ selected: active }}
                        style={({ hovered, pressed }) => [
                          styles.desktopLink,
                          (hovered || pressed) && { opacity: 0.75 },
                          active && { borderBottomColor: TRACK_COLOR },
                        ]}
                      >
                        <View style={styles.linkRow}>
                          <Ionicons
                            name={item.icon}
                            size={18}
                            color={active ? TRACK_COLOR : colors.textMuted}
                          />
                          <Text
                            style={[
                              styles.desktopLinkText,
                              { color: active ? TRACK_COLOR : colors.text },
                              active && styles.desktopLinkTextActive,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </Pressable>
                    </Link>
                  </View>
                );
              })}
            </View>
          ) : (
            <Pressable
              onPress={() => setMenuOpen((open) => !open)}
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? "Close menu" : "Open menu"}
              hitSlop={8}
              style={({ hovered, pressed }) => [
                styles.menuButton,
                { borderColor: colors.border, backgroundColor: colors.surfaceSolid },
                (hovered || pressed) && { opacity: 0.8 },
              ]}
            >
              <Ionicons
                name={menuOpen ? "close" : "menu"}
                size={22}
                color={TRACK_COLOR}
              />
            </Pressable>
          )}
        </View>
      </View>

      {!isDesktop && menuOpen ? (
        <>
          <View style={[styles.menuPanel, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            {WEB_NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, String(item.href));
              return (
                <Link key={item.label} href={item.href} asChild>
                  <Pressable
                    onPress={closeMenu}
                    accessibilityRole="link"
                    accessibilityState={{ selected: active }}
                    style={({ hovered, pressed }) => [
                      styles.menuItem,
                      active && { backgroundColor: colors.surfaceSolid },
                      (hovered || pressed) && { backgroundColor: colors.surfaceSolid },
                    ]}
                  >
                    <View style={styles.linkRow}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={active ? TRACK_COLOR : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.menuItemText,
                          { color: active ? TRACK_COLOR : colors.text },
                          active && styles.desktopLinkTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </Pressable>
                </Link>
              );
            })}
          </View>
          <Pressable
            onPress={closeMenu}
            accessibilityLabel="Dismiss menu"
            style={[
              styles.backdrop,
              {
                backgroundColor: colors.modalOverlay,
                height,
              },
            ]}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    position: "relative",
    overflow: "visible",
  },
  bar: {
    paddingBottom: 8,
  },
  barInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: scaleSpacing(20),
    minHeight: 48,
  },
  brandButton: {
    paddingVertical: 6,
    paddingRight: 12,
    cursor: "pointer",
  },
  brand: {
    color: TRACK_COLOR,
    fontSize: scaleFont(18),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  desktopLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  desktopLinkWrap: {
    marginLeft: 40,
  },
  desktopLink: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    cursor: "pointer",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  desktopLinkText: {
    fontSize: scaleFont(15),
    fontWeight: "600",
  },
  desktopLinkTextActive: {
    fontWeight: "700",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  menuPanel: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 2,
    borderBottomWidth: 1,
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(16),
    gap: scaleSpacing(10),
  },
  menuItem: {
    paddingHorizontal: scaleSpacing(14),
    paddingVertical: scaleSpacing(16),
    borderRadius: 10,
    minHeight: 52,
    justifyContent: "center",
    cursor: "pointer",
  },
  menuItemText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    zIndex: 1,
  },
});
