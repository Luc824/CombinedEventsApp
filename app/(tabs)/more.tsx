import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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
// Temporarily disabled for Expo Go testing
// import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";

// Temporarily disabled types for Expo Go testing
// type PurchasesOffering = any;
// type PurchasesPackage = any;

/** Static tip tiers — UI preview in Expo Go; RevenueCat wired in production builds */
const FALLBACK_TIERS = ["Amateur", "Pro", "GOAT"] as const;

const PACKAGE_PRICES: Record<string, string> = {
  donation_tier1: "0.99",
  donation_tier2: "1.99",
  donation_tier3: "9.99",
};


export default function MoreScreen() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = ThemeColors[theme];
  // Temporarily disabled for Expo Go testing
  // const [loading, setLoading] = useState(false);
  // const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  // useEffect(() => {
  //   // Temporarily disabled for Expo Go testing
  //   // RevenueCat requires native modules and doesn't work in Expo Go
  //   /*
  //   // Only load RevenueCat offerings on iOS/Android, not web
  //   if (Platform.OS === 'web') {
  //     return;
  //   }
  //   
  //   const loadOfferings = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await Purchases.getOfferings();
  //       const offering = (data as any).all?.tips || (data as any).current || null;
  //       if (__DEV__) {
  //         console.log("RC offering identifiers:", Object.keys(data.all || {}));
  //         console.log("RC using offering:", offering?.identifier);
  //         console.log(
  //           "RC available packages:",
  //           (offering?.availablePackages || []).map((p: any) => p.identifier)
  //         );
  //       }
  //       setOfferings(offering);
  //     } catch (e) {
  //       if (__DEV__) {
  //         console.warn("Failed to load RevenueCat offerings", e);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadOfferings();
  //   */
  // }, []);  

  // const donationPackages = useMemo(() => {
  //   if (!offerings) return [] as PurchasesPackage[];
  //   const pkgs = offerings.availablePackages ?? [];
  //   const map = new Map<string, PurchasesPackage>();

  //   pkgs.forEach((pkg: any) => {
  //     const candidates = [
  //       pkg.storeProduct?.identifier,
  //       pkg.storeProduct?.productIdentifier,
  //       pkg.product?.identifier,
  //       pkg.identifier,
  //     ].filter(Boolean);

  //     candidates.forEach((id: string) => {
  //       if (!map.has(id)) {
  //         map.set(id, pkg);
  //       }
  //     });
  //   });

  //   return ["donation_tier1", "donation_tier2", "donation_tier3"]
  //     .map((id) => map.get(id))
  //     .filter(Boolean) as PurchasesPackage[];
  // }, [offerings]);
  
  const handleFeedback = () => {
    // Update this email address to your preferred contact email
    // You can use a Gmail alias like: yourname+app@gmail.com
    Linking.openURL("mailto:luc.coolbrew@gmail.com?subject=App Feedback");
  };

  const handleReview = () => {
    Linking.openURL("https://apps.apple.com/app/6752707829?action=write-review");
  };

  const handleGetApp = () => {
    // Replace YOUR_APP_ID with your actual App Store ID
    Linking.openURL("https://apps.apple.com/app/6752707829");
  };

  const handleSavedScores = () => {
    if (Platform.OS === 'web') {
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

  /** Expo Go / dev preview — purchases need a native build + RevenueCat */
  const handleTipPress = (tier: string) => {
    if (Platform.OS === "web") {
      handleWebDonate(tier);
      return;
    }
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
          style={[styles.button, surfacePillButtonStyle, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]} 
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

        {Platform.OS !== 'web' && (
          <TouchableOpacity style={[styles.button, surfacePillButtonStyle, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]} onPress={handleSavedScores}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Saved Scores</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, surfacePillButtonStyle, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]} onPress={handleFeedback}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, surfacePillButtonStyle, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]} onPress={handleReview}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Leave a Review</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' && (
          <TouchableOpacity style={[styles.button, pillButtonStyle, buttonElevation(), { backgroundColor: TRACK_COLOR }]} onPress={handleGetApp}>
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>📱 Get the App</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tips</Text>
        <View style={styles.donateRow}>
          {FALLBACK_TIERS.map((tier, index) => {
            const price = PACKAGE_PRICES[`donation_tier${index + 1}`] ?? "";
            return (
              <TouchableOpacity
                key={tier}
                style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
                onPress={() => handleTipPress(tier)}
              >
                <Text style={styles.donateTier}>{tier}</Text>
                {price ? <Text style={styles.donateAmount}>{price}</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>

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
