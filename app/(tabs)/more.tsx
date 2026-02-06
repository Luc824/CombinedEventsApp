import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../constants/ThemeColors";
// Temporarily disabled for Expo Go testing
// import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";

// Temporarily disabled types for Expo Go testing
// type PurchasesOffering = any;
// type PurchasesPackage = any;

const TRACK_COLOR = "#D35400";

// Temporarily disabled for Expo Go testing
// UI falls back to static tiers if offerings are not available
// const FALLBACK_TIERS = ["Amateur", "Pro", "GOAT"];

// const PACKAGE_LABELS: Record<string, string> = {
//   donation_tier1: "Amateur",
//   donation_tier2: "Pro",
//   donation_tier3: "GOAT",
// };

// const PACKAGE_PRICES: Record<string, string> = {
//   donation_tier1: "0.99",
//   donation_tier2: "1.99",
//   donation_tier3: "9.99",
// };


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

  // Temporarily disabled for Expo Go testing
  // const handleWebDonate = (amount: string) => {
  //   // Replace with your PayPal donation links
  //   // You can create these at: https://www.paypal.com/donate/buttons
  //   const paypalLinks: Record<string, string> = {
  //     "Amateur": "https://www.paypal.com/donate/?hosted_button_id=ADXATUGCAGQSQ",
  //     "Pro": "https://www.paypal.com/donate/?hosted_button_id=ADXATUGCAGQSQ",
  //     "GOAT": "https://www.paypal.com/donate/?hosted_button_id=ADXATUGCAGQSQ",
  //   };
  //   
  //   const link = paypalLinks[amount] || paypalLinks["Amateur"];
  //   Linking.openURL(link);
  // };

  // const handleDonate = async (pkg?: PurchasesPackage) => {
  //   // Temporarily disabled for Expo Go testing
  //   Alert.alert("Unavailable", "Donations are temporarily disabled for testing.");
  //   /*
  //   try {
  //     if (!pkg) {
  //       Alert.alert("Unavailable", "No donation package is available right now.");
  //       return;
  //     }
  //     setLoading(true);
  //     const { customerInfo } = await Purchases.purchasePackage(pkg);
  //     Alert.alert("Thank you!", "Your donation was successful. 🙏");
  //   } catch (e: any) {
  //     if (e?.userCancelled) return; // silent cancel
  //     Alert.alert("Purchase failed", e?.message ?? "Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  //   */
  // };


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Support & More</Text>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]} 
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
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]} onPress={handleSavedScores}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Saved Scores</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]} onPress={handleFeedback}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]} onPress={handleReview}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Leave a Review</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' && (
          <TouchableOpacity style={[styles.button, styles.getAppButton, { backgroundColor: TRACK_COLOR }]} onPress={handleGetApp}>
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>📱 Get the App</Text>
          </TouchableOpacity>
        )}

        {/* Temporarily disabled for Expo Go testing
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tips</Text>
        <View style={styles.donateRow}>
          {FALLBACK_TIERS.map((tier) => {
            const price = PACKAGE_PRICES[`donation_tier${FALLBACK_TIERS.indexOf(tier) + 1}`] ?? "";
            return (
              <TouchableOpacity
                key={tier}
                style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
                onPress={() => handleWebDonate(tier)}
              >
                <Text style={styles.donateTier}>{tier}</Text>
                {price && <Text style={styles.donateAmount}>{price}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        Temporarily disabled RevenueCat code for Expo Go testing
        {Platform.OS === 'web' ? (
          // Web donations using PayPal links
          <View style={styles.donateRow}>
            {FALLBACK_TIERS.map((tier) => {
              const price = PACKAGE_PRICES[`donation_tier${FALLBACK_TIERS.indexOf(tier) + 1}`] ?? "";
              return (
                <TouchableOpacity
                  key={tier}
                  style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
                  onPress={() => handleWebDonate(tier)}
                >
                  <Text style={styles.donateTier}>{tier}</Text>
                  {price && <Text style={styles.donateAmount}>{price}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          // iOS/Android donations using RevenueCat
          donationPackages.length > 0 ? (
            <View style={styles.donateRow}>
              {donationPackages.slice(0, 3).map((pkg: any) => {
                const sp = pkg.storeProduct ?? pkg.product;
                const pkgId =
                  pkg.storeProduct?.identifier ??
                  pkg.storeProduct?.productIdentifier ??
                  pkg.product?.identifier ??
                  pkg.identifier;
                const label = PACKAGE_LABELS[pkgId] ?? sp?.title ?? "Tip";
                const price = PACKAGE_PRICES[pkgId] ?? "";
                return (
                  <TouchableOpacity
                    key={pkg.identifier}
                    style={[styles.donateButton, { backgroundColor: TRACK_COLOR, opacity: loading ? 0.7 : 1 }]}
                    onPress={() => handleDonate(pkg)}
                    disabled={loading}
                  >
                    <Text style={styles.donateTier}>{label}</Text>
                    {price && <Text style={styles.donateAmount}>{price}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.donateRow}>
              {FALLBACK_TIERS.map((tier) => (
                <TouchableOpacity
                  key={tier}
                  style={[styles.donateButton, { backgroundColor: TRACK_COLOR, opacity: 0.7 }]}
                  onPress={() => Alert.alert("Coming soon", "Donation products loading. Try again later.")}
                >
                  <Text style={styles.donateTier}>{tier}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )
        )}
        */}

        {/* Temporarily disabled for Expo Go testing
        <Text style={[styles.donateMessage, { color: colors.textSecondary }]}>
          Support this app (no pole vault required!)
        </Text>
        */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 34,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginBottom: 18,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  themeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  themeIcon: {
    marginRight: 8,
  },
  getAppButton: {
    // backgroundColor set dynamically
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  donateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 350,
    marginTop: 10,
    gap: 12,
  },
  donateButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 0,
  },
  donateTier: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  donateAmount: {
    color: "#fff",
    fontSize: 15,
  },
  donateMessage: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 0,
  },
});
