import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
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

const LOGO = require("../assets/images/icon.png");

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname === "" || pathname === "/index";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon({ open, color }: { open: boolean; color: string }) {
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 320,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  const topStyle = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-7, 0],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const midStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [1, 0, 0],
    }),
    transform: [
      {
        scaleX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.4],
        }),
      },
    ],
  };

  const bottomStyle = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [7, 0],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "-45deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.menuIcon}>
      <Animated.View style={[styles.menuBar, { backgroundColor: color }, topStyle]} />
      <Animated.View style={[styles.menuBar, { backgroundColor: color }, midStyle]} />
      <Animated.View
        style={[styles.menuBar, { backgroundColor: color }, bottomStyle]}
      />
    </View>
  );
}

export default function WebNavBar() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= WEB_NAV_BREAKPOINT;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, isDesktop]);

  useEffect(() => {
    Animated.timing(menuProgress, {
      toValue: menuOpen ? 1 : 0,
      duration: 380,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [menuOpen, menuProgress]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return;
    }
    const previous = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const topPad = Math.max(insets.top, 8);
  const barHeight = topPad + 48 + 8;

  const overlayStyle = {
    opacity: menuProgress,
    transform: [
      {
        translateY: menuProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-12, 0],
        }),
      },
    ],
  };

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
      <View
        style={[
          styles.bar,
          {
            paddingTop: topPad,
            zIndex: 30,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.barInner}>
          <Pressable
            onPress={() => {
              closeMenu();
              router.navigate("/");
            }}
            accessibilityRole="link"
            accessibilityLabel="CE Points home"
            style={({ hovered, pressed }: any) => [
              styles.brandButton,
              (hovered || pressed) && { opacity: 0.8 },
            ]}
          >
            <Image
              source={LOGO}
              style={styles.brandLogo}
              accessibilityIgnoresInvertColors
            />
          </Pressable>

          {isDesktop ? (
            <View style={styles.desktopLinks} pointerEvents="box-none">
              {WEB_NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, String(item.href));
                return (
                  <View key={item.label} style={styles.desktopLinkWrap}>
                    <Link href={item.href} asChild>
                      <Pressable
                        accessibilityRole="link"
                        accessibilityState={{ selected: active }}
                        style={({ hovered, pressed }: any) => [
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
              style={({ hovered, pressed }: any) => [
                styles.menuButton,
                (hovered || pressed) && { opacity: 0.75 },
              ]}
            >
              <MenuIcon open={menuOpen} color={TRACK_COLOR} />
            </Pressable>
          )}

          {/* Balances the logo so desktop tabs sit truly centered */}
          {isDesktop ? <View style={styles.brandSpacer} /> : null}
        </View>
      </View>

      {!isDesktop ? (
        <Animated.View
          pointerEvents={menuOpen ? "auto" : "none"}
          style={[
            styles.fullMenu,
            {
              backgroundColor: colors.background,
              paddingTop: barHeight + scaleSpacing(24),
              paddingBottom: Math.max(insets.bottom, scaleSpacing(32)),
            },
            overlayStyle,
          ]}
        >
          <View style={styles.fullMenuLinks}>
            {WEB_NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, String(item.href));
              return (
                <Link key={item.label} href={item.href} asChild>
                  <Pressable
                    onPress={closeMenu}
                    accessibilityRole="link"
                    accessibilityState={{ selected: active }}
                    style={({ hovered, pressed }: any) => [
                      styles.fullMenuItem,
                      { borderBottomColor: colors.border },
                      (hovered || pressed) && { opacity: 0.7 },
                    ]}
                  >
                    <View style={styles.linkRow}>
                      <Ionicons
                        name={item.icon}
                        size={26}
                        color={active ? TRACK_COLOR : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.fullMenuItemText,
                          {
                            color: active ? TRACK_COLOR : colors.text,
                            opacity: menuOpen ? 1 : 0,
                          },
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
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    position: "relative",
    overflow: "visible",
  },
  bar: {
    paddingBottom: 8,
    position: "relative",
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
    position: "relative",
  },
  brandButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    cursor: "pointer",
  },
  brandLogo: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  brandSpacer: {
    width: 52,
    height: 52,
  },
  desktopLinks: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  desktopLinkWrap: {
    marginLeft: 0,
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
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    cursor: "pointer",
  },
  menuIcon: {
    width: 22,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBar: {
    position: "absolute",
    width: 22,
    height: 2,
    borderRadius: 1,
  },
  fullMenu: {
    ...Platform.select({
      web: {
        position: "fixed" as any,
      },
      default: {
        position: "absolute",
      },
    }),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 25,
    paddingHorizontal: scaleSpacing(28),
    justifyContent: "center",
  },
  fullMenuLinks: {
    gap: scaleSpacing(8),
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
    marginBottom: scaleSpacing(48),
  },
  fullMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scaleSpacing(18),
    borderBottomWidth: StyleSheet.hairlineWidth,
    cursor: "pointer",
  },
  fullMenuItemText: {
    fontSize: scaleFont(32),
    fontWeight: "700",
    letterSpacing: -0.4,
  },
});
