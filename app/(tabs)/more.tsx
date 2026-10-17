import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import PressableFeedback from "../../components/PressableFeedback";
import SwipeableTabWrapper from "../../components/SwipeableTabWrapper";
import { ThemeColors } from "../../constants/ThemeColors";
import {
  TRACK_COLOR,
  Radius,
  ScreenLayout,
  pillButtonStyle,
  surfacePillButtonStyle,
  buttonElevation,
  tabHubContentOffset,
} from "../../constants/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { useStableTabPaint } from "../../hooks/useStableTabPaint";
import { FROZEN_INSETS } from "../../utils/frozenSafeArea";
import {
  getPackagePriceLabel,
  loadDonationCatalog,
  purchaseDonationPackage,
  type DonationPackage,
} from "../../utils/purchases";
import { openAppReview, openAppStore } from "../../utils/openUrl";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";
import { useSafePush } from "../../utils/useSafePush";

const FALLBACK_TIERS = ["Amateur", "Pro", "GOAT"] as const;

/** Open PayPal Donate button (any amount). */
const WEB_PAYPAL_DONATE_URL =
  "https://www.paypal.com/donate/?hosted_button_id=VZWTBDK6CNYQQ";

/** Feedback → Featurebase. Contact → Tally (emails you; collect their email to reply). */
const FEEDBACK_URL = "https://combinedeventscalculator.featurebase.app";
const CONTACT_URL = "https://tally.so/r/8No29l";

const PACKAGE_LABELS: Record<string, string> = {
  donation_tier1: "Amateur",
  donation_tier2: "Pro",
  donation_tier3: "GOAT",
};

function getPackageLabel(pkg: DonationPackage): string {
  const sp = pkg.storeProduct ?? (pkg as { product?: { identifier?: string; title?: string } }).product;
  const pkgId =
    pkg.storeProduct?.identifier ??
    pkg.storeProduct?.productIdentifier ??
    sp?.identifier ??
    pkg.identifier;
  return PACKAGE_LABELS[pkgId] ?? sp?.title ?? "Tip";
}

async function openExternalUrl(url: string, label: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Unavailable", `Could not open ${label}.`);
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unavailable", `Could not open ${label}.`);
  }
}

export default function MoreScreen() {
  const safePush = useSafePush();
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = ThemeColors[theme];
  const { height } = useWindowDimensions();
  const paintReady = useStableTabPaint();
  const [loading, setLoading] = useState(false);
  const [donationPackages, setDonationPackages] = useState<DonationPackage[]>([]);
  const [priceByProductId, setPriceByProductId] = useState<Record<string, string>>(
    {}
  );
  const contentOffset =
    Platform.OS === "web"
      ? scaleSpacing(32)
      : FROZEN_INSETS.top + tabHubContentOffset(height);
  const scrollBottomPadding =
    Platform.OS === "android"
      ? Math.max(FROZEN_INSETS.bottom, scaleSpacing(16)) + scaleSpacing(88)
      : scaleSpacing(32);
  const showFeedbackLinks = Boolean(FEEDBACK_URL || CONTACT_URL);

  const refreshDonationPackages = useCallback(async () => {
    if (Platform.OS === "web") {
      return;
    }

    try {
      setLoading(true);
      const catalog = await loadDonationCatalog();
      setDonationPackages(catalog.packages);
      setPriceByProductId(catalog.priceByProductId);
    } catch (e) {
      if (__DEV__) {
        console.warn("Failed to load RevenueCat offerings", e);
      }
      setDonationPackages([]);
      setPriceByProductId({});
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshDonationPackages();
    }, [refreshDonationPackages])
  );

  const handleReview = () => {
    openAppReview();
  };

  const handleGetApp = () => {
    openAppStore();
  };

  const handleSavedScores = () => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "This feature is only available on iOS and Android.");
      return;
    }
    safePush("/saved-scores" as any);
  };

  const handleWebDonate = () => {
    Linking.openURL(WEB_PAYPAL_DONATE_URL);
  };

  const handleDonate = async (pkg?: DonationPackage) => {
    try {
      if (!pkg) {
        Alert.alert("Unavailable", "No donation package is available right now.");
        return;
      }
      setLoading(true);
      await purchaseDonationPackage(pkg);
      Alert.alert("Thank you!", "Your donation was successful.");
    } catch (e: any) {
      if (e?.userCancelled) return;
      Alert.alert("Purchase failed", e?.message ?? "Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderTipButtons = () => {
    if (Platform.OS === "web") {
      return (
        <PressableFeedback
          style={[
            styles.webDonateButton,
            pillButtonStyle,
            buttonElevation(),
            { backgroundColor: TRACK_COLOR },
          ]}
          onPress={handleWebDonate}
          accessibilityRole="link"
          accessibilityLabel="Leave a tip"
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Leave a tip
          </Text>
        </PressableFeedback>
      );
    }

    if (donationPackages.length > 0) {
      return (
        <View style={styles.donateRow}>
          {donationPackages.slice(0, 3).map((pkg) => {
            const label = getPackageLabel(pkg);
            const price = getPackagePriceLabel(pkg, priceByProductId);
            return (
              <PressableFeedback
                key={pkg.identifier}
                style={[
                  styles.donateButton,
                  { backgroundColor: TRACK_COLOR, opacity: loading ? 0.7 : 1 },
                ]}
                onPress={() => handleDonate(pkg)}
                disabled={loading}
              >
                <Text style={styles.donateTier}>{label}</Text>
                <Text style={styles.donateAmount}>{price || " "}</Text>
              </PressableFeedback>
            );
          })}
        </View>
      );
    }

    return (
      <View style={styles.donateRow}>
        {FALLBACK_TIERS.map((tier) => {
          return (
            <PressableFeedback
              key={tier}
              style={[styles.donateButton, { backgroundColor: TRACK_COLOR, opacity: 0.7 }]}
              onPress={() =>
                Alert.alert(
                  "Tips unavailable",
                  "In-app tips could not be loaded. Check your connection and try again, or update the app once products are configured in App Store Connect."
                )
              }
            >
              <Text style={styles.donateTier}>{tier}</Text>
            </PressableFeedback>
          );
        })}
      </View>
    );
  };

  return (
    <SwipeableTabWrapper tabIndex={2}>
      <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        <ScrollView
          style={[
            styles.scrollView,
            { opacity: Platform.OS === "web" || paintReady ? 1 : 0 },
          ]}
          contentContainerStyle={[
            styles.scrollContent,
            {
              backgroundColor: colors.background,
              paddingTop: contentOffset,
              paddingBottom: scrollBottomPadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.titleRow}>
          <View style={styles.titleSideSpacer} />
          <Text style={[styles.title, { color: colors.text }]}>Support & More</Text>
          <PressableFeedback
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={[
              styles.themeIconButton,
              {
                backgroundColor: colors.surfaceSolid,
                borderColor: colors.border,
              },
            ]}
            hitSlop={8}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={18}
              color={colors.text}
            />
          </PressableFeedback>
        </View>

        {Platform.OS !== "web" && (
          <PressableFeedback
            style={[
              styles.button,
              surfacePillButtonStyle,
              { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
            ]}
            onPress={handleSavedScores}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Saved Scores</Text>
          </PressableFeedback>
        )}
        {Platform.OS !== "web" && (
          <PressableFeedback
            style={[
              styles.button,
              surfacePillButtonStyle,
              { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
            ]}
            onPress={handleReview}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Leave a Review</Text>
          </PressableFeedback>
        )}

        {showFeedbackLinks && (
          <View style={styles.linkRow}>
            {FEEDBACK_URL ? (
              <PressableFeedback
                style={[
                  styles.linkButton,
                  surfacePillButtonStyle,
                  { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
                ]}
                onPress={() => openExternalUrl(FEEDBACK_URL, "Feedback")}
                accessibilityRole="link"
                accessibilityLabel="Feature requests and feedback"
              >
                <Text style={[styles.linkButtonText, { color: colors.text }]}>
                  Feedback
                </Text>
              </PressableFeedback>
            ) : null}
            {CONTACT_URL ? (
              <PressableFeedback
                style={[
                  styles.linkButton,
                  surfacePillButtonStyle,
                  { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
                ]}
                onPress={() => openExternalUrl(CONTACT_URL, "Contact")}
                accessibilityRole="link"
                accessibilityLabel="Contact"
              >
                <Text style={[styles.linkButtonText, { color: colors.text }]}>
                  Contact
                </Text>
              </PressableFeedback>
            ) : null}
          </View>
        )}

        {Platform.OS === "web" && (
          <PressableFeedback
            style={[
              styles.button,
              surfacePillButtonStyle,
              { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
            ]}
            onPress={() => safePush("/combined-events-explained")}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Combined Events explained
            </Text>
          </PressableFeedback>
        )}

        {Platform.OS === "web" && (
          <PressableFeedback
            style={[
              styles.button,
              pillButtonStyle,
              buttonElevation(),
              { backgroundColor: TRACK_COLOR },
            ]}
            onPress={handleGetApp}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>📱 Get the App</Text>
          </PressableFeedback>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tips</Text>
        {renderTipButtons()}

        <Text style={[styles.donateMessage, { color: colors.textSecondary }]}>
          Support this app (no pole vault required!)
        </Text>
      </ScrollView>
      </View>
    </SwipeableTabWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: { alignItems: "center" },
    }),
  },
  scrollView: {
    flex: 1,
    ...Platform.select({
      web: { maxWidth: ScreenLayout.contentMaxWidth, width: "100%" },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: ScreenLayout.horizontalPadding,
    alignItems: "stretch",
    ...Platform.select({
      web: { alignSelf: "center", width: "100%" },
    }),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ScreenLayout.sectionGap,
    minHeight: scaleSpacing(40),
  },
  titleSideSpacer: {
    width: scaleSpacing(40),
  },
  title: {
    flex: 1,
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: scaleSpacing(34),
  },
  themeIconButton: {
    width: scaleSpacing(40),
    height: scaleSpacing(40),
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: ScreenLayout.buttonGap,
    width: "100%",
  },
  buttonText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row",
    width: "100%",
    gap: scaleSpacing(10),
    marginBottom: ScreenLayout.buttonGap,
  },
  linkButton: {
    flex: 1,
    minHeight: scaleSpacing(44),
    paddingVertical: scaleSpacing(10),
  },
  linkButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    marginTop: scaleSpacing(28),
    marginBottom: scaleSpacing(12),
    textAlign: "center",
  },
  webDonateButton: {
    width: "100%",
  },
  donateRow: {
    flexDirection: "row",
    width: "100%",
    gap: scaleSpacing(10),
  },
  donateButton: {
    flex: 1,
    borderRadius: Radius.pill,
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(4),
    alignItems: "center",
    justifyContent: "center",
    minHeight: scaleSpacing(64),
  },
  donateTier: {
    color: "#fff",
    fontSize: scaleFont(15),
    fontWeight: "bold",
    marginBottom: scaleSpacing(2),
  },
  donateAmount: {
    color: "#fff",
    fontSize: scaleFont(14),
    fontWeight: "400",
  },
  donateMessage: {
    fontSize: scaleFont(13),
    textAlign: "center",
    marginTop: scaleSpacing(10),
    marginBottom: 0,
  },
});
