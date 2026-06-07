import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import { ThemeColors } from "../../constants/ThemeColors";
import {
  TRACK_COLOR,
  Radius,
  ScreenLayout,
  pillButtonStyle,
  surfacePillButtonStyle,
  buttonElevation,
} from "../../constants/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

const FALLBACK_TIERS = ["Amateur", "Pro", "GOAT"] as const;

const PACKAGE_LABELS: Record<string, string> = {
  donation_tier1: "Amateur",
  donation_tier2: "Pro",
  donation_tier3: "GOAT",
};

const PACKAGE_PRICES: Record<string, string> = {
  donation_tier1: "0.99",
  donation_tier2: "1.99",
  donation_tier3: "9.99",
};

function getPackageLabel(pkg: PurchasesPackage): string {
  const sp = pkg.storeProduct ?? (pkg as any).product;
  const pkgId =
    pkg.storeProduct?.identifier ??
    pkg.storeProduct?.productIdentifier ??
    sp?.identifier ??
    pkg.identifier;
  return PACKAGE_LABELS[pkgId] ?? sp?.title ?? "Tip";
}

function getPackagePrice(pkg: PurchasesPackage): string {
  const sp = pkg.storeProduct ?? (pkg as any).product;
  const pkgId =
    pkg.storeProduct?.identifier ??
    pkg.storeProduct?.productIdentifier ??
    sp?.identifier ??
    pkg.identifier;
  return PACKAGE_PRICES[pkgId] ?? sp?.priceString ?? "";
}

export default function MoreScreen() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = ThemeColors[theme];
  const [loading, setLoading] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const loadOfferings = async () => {
      try {
        setLoading(true);
        const data = await Purchases.getOfferings();
        const offering = (data as any).all?.tips || data.current || null;
        setOfferings(offering);
      } catch (e) {
        if (__DEV__) {
          console.warn("Failed to load RevenueCat offerings", e);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOfferings();
  }, []);

  const donationPackages = useMemo(() => {
    if (!offerings) return [] as PurchasesPackage[];
    const pkgs = offerings.availablePackages ?? [];
    const map = new Map<string, PurchasesPackage>();

    pkgs.forEach((pkg) => {
      const candidates = [
        pkg.storeProduct?.identifier,
        pkg.storeProduct?.productIdentifier,
        (pkg as any).product?.identifier,
        pkg.identifier,
      ].filter(Boolean) as string[];

      candidates.forEach((id) => {
        if (!map.has(id)) {
          map.set(id, pkg);
        }
      });
    });

    return ["donation_tier1", "donation_tier2", "donation_tier3"]
      .map((id) => map.get(id))
      .filter(Boolean) as PurchasesPackage[];
  }, [offerings]);

  const handleFeedback = () => {
    Linking.openURL("mailto:luc.coolbrew@gmail.com?subject=App Feedback");
  };

  const handleReview = () => {
    Linking.openURL("https://apps.apple.com/app/6752707829?action=write-review");
  };

  const handleGetApp = () => {
    Linking.openURL("https://apps.apple.com/app/6752707829");
  };

  const handleSavedScores = () => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "This feature is only available on iOS and Android.");
      return;
    }
    router.push("/saved-scores" as any);
  };

  const handleWebDonate = (tier: string) => {
    const paypalLinks: Record<string, string> = {
      Amateur: "https://www.paypal.com/donate/?hosted_button_id=ADXATUGCAGQSQ",
      Pro: "https://www.paypal.com/donate/?hosted_button_id=ADXATUGCAGQSQ",
      GOAT: "https://www.paypal.com/donate/?hosted_button_id=ADXATUGCAGQSQ",
    };
    Linking.openURL(paypalLinks[tier] ?? paypalLinks.Amateur);
  };

  const handleDonate = async (pkg?: PurchasesPackage) => {
    try {
      if (!pkg) {
        Alert.alert("Unavailable", "No donation package is available right now.");
        return;
      }
      setLoading(true);
      await Purchases.purchasePackage(pkg);
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
        <View style={styles.donateRow}>
          {FALLBACK_TIERS.map((tier, index) => {
            const price = PACKAGE_PRICES[`donation_tier${index + 1}`] ?? "";
            return (
              <TouchableOpacity
                key={tier}
                style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
                onPress={() => handleWebDonate(tier)}
              >
                <Text style={styles.donateTier}>{tier}</Text>
                {price ? <Text style={styles.donateAmount}>{price}</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (donationPackages.length > 0) {
      return (
        <View style={styles.donateRow}>
          {donationPackages.slice(0, 3).map((pkg) => {
            const label = getPackageLabel(pkg);
            const price = getPackagePrice(pkg);
            return (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.donateButton,
                  { backgroundColor: TRACK_COLOR, opacity: loading ? 0.7 : 1 },
                ]}
                onPress={() => handleDonate(pkg)}
                disabled={loading}
              >
                <Text style={styles.donateTier}>{label}</Text>
                {price ? <Text style={styles.donateAmount}>{price}</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return (
      <View style={styles.donateRow}>
        {FALLBACK_TIERS.map((tier, index) => {
          const price = PACKAGE_PRICES[`donation_tier${index + 1}`] ?? "";
          return (
            <TouchableOpacity
              key={tier}
              style={[styles.donateButton, { backgroundColor: TRACK_COLOR, opacity: 0.7 }]}
              onPress={() =>
                Alert.alert("Coming soon", "Donation products loading. Try again later.")
              }
            >
              <Text style={styles.donateTier}>{tier}</Text>
              {price ? <Text style={styles.donateAmount}>{price}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Support & More</Text>

        <TouchableOpacity
          style={[
            styles.button,
            surfacePillButtonStyle,
            { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
          ]}
          onPress={toggleTheme}
        >
          <View style={styles.themeToggleRow}>
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={20}
              color={colors.text}
              style={styles.themeIcon}
            />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {isDark ? "Light Mode" : "Dark Mode"}
            </Text>
          </View>
        </TouchableOpacity>

        {Platform.OS !== "web" && (
          <TouchableOpacity
            style={[
              styles.button,
              surfacePillButtonStyle,
              { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
            ]}
            onPress={handleSavedScores}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Saved Scores</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            surfacePillButtonStyle,
            { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
          ]}
          onPress={handleFeedback}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            surfacePillButtonStyle,
            { backgroundColor: colors.surfaceSolid, borderColor: colors.border },
          ]}
          onPress={handleReview}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Leave a Review</Text>
        </TouchableOpacity>

        {Platform.OS === "web" && (
          <TouchableOpacity
            style={[
              styles.button,
              pillButtonStyle,
              buttonElevation(),
              { backgroundColor: TRACK_COLOR },
            ]}
            onPress={handleGetApp}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>📱 Get the App</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tips</Text>
        {renderTipButtons()}

        <Text style={[styles.donateMessage, { color: colors.textSecondary }]}>
          Support this app (no pole vault required!)
        </Text>
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: "center",
    paddingHorizontal: ScreenLayout.horizontalPadding,
    paddingVertical: scaleSpacing(32),
    alignItems: "stretch",
    ...Platform.select({
      web: { alignSelf: "center", width: "100%" },
    }),
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    marginBottom: ScreenLayout.sectionGap,
    textAlign: "center",
    lineHeight: scaleSpacing(34),
  },
  button: {
    marginBottom: ScreenLayout.buttonGap,
    width: "100%",
  },
  buttonText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  themeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  themeIcon: {
    marginRight: scaleSpacing(8),
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    marginTop: scaleSpacing(28),
    marginBottom: scaleSpacing(12),
    textAlign: "center",
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
