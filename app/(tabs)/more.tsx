import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";

const TRACK_COLOR = "#D35400";

// UI falls back to static tiers if offerings are not available
const FALLBACK_TIERS = ["Amateur", "Pro", "GOAT"];

const PACKAGE_LABELS: Record<string, string> = {
  donation_tier1: "Amateur",
  donation_tier2: "Pro",
  donation_tier3: "GOAT",
};

export default function MoreScreen() {
  const [loading, setLoading] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        setLoading(true);
        const data = await Purchases.getOfferings();
        const offering = (data as any).all?.tips || (data as any).current || null;
        if (__DEV__) {
          console.log("RC offering identifiers:", Object.keys(data.all || {}));
          console.log("RC using offering:", offering?.identifier);
          console.log(
            "RC available packages:",
            (offering?.availablePackages || []).map((p: any) => p.identifier)
          );
        }
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

    pkgs.forEach((pkg: any) => {
      const candidates = [
        pkg.storeProduct?.identifier,
        pkg.storeProduct?.productIdentifier,
        pkg.product?.identifier,
        pkg.identifier,
      ].filter(Boolean);

      candidates.forEach((id: string) => {
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
    Linking.openURL("mailto:yourfeedback@email.com?subject=App Feedback");
  };

  const handleReview = () => {
    Linking.openURL("https://yourappstorelink.com");
  };

  const handleDonate = async (pkg?: PurchasesPackage) => {
    try {
      if (!pkg) {
        Alert.alert("Unavailable", "No donation package is available right now.");
        return;
      }
      setLoading(true);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      Alert.alert("Thank you!", "Your donation was successful. 🙏");
    } catch (e: any) {
      if (e?.userCancelled) return; // silent cancel
      Alert.alert("Purchase failed", e?.message ?? "Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <Text style={styles.title}>Support & More</Text>
        <TouchableOpacity style={styles.button} onPress={handleFeedback}>
          <Text style={styles.buttonText}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReview}>
          <Text style={styles.buttonText}>Leave a Review</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tips</Text>
        {donationPackages.length > 0 ? (
          <View style={styles.donateRow}>
            {donationPackages.slice(0, 3).map((pkg: any) => {
              const sp = pkg.storeProduct ?? pkg.product;
              const pkgId =
                pkg.storeProduct?.identifier ??
                pkg.storeProduct?.productIdentifier ??
                pkg.product?.identifier ??
                pkg.identifier;
              const label = PACKAGE_LABELS[pkgId] ?? sp?.title ?? "Tip";
      return (
        <TouchableOpacity
          key={pkg.identifier}
          style={[styles.donateButton, { backgroundColor: TRACK_COLOR, opacity: loading ? 0.7 : 1 }]}
          onPress={() => handleDonate(pkg)}
          disabled={loading}
        >
                  <Text style={styles.donateTier}>{label}</Text>
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
)}

        <Text style={styles.donateMessage}>
          Support this app (no pole vault required!)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 34,
  },
  button: {
    backgroundColor: "#222",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginBottom: 18,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
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
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 0,
    opacity: 0.85,
  },
});
