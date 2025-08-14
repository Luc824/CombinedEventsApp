import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

const TRACK_COLOR = "#D35400";

const DONATION_TIERS = [
  { name: "Amateur", displayAmount: "0.99€" },
  { name: "Pro", displayAmount: "2.99€" },
  { name: "GOAT", displayAmount: "9.99€" },
];

export default function MoreScreen() {
  const handleFeedback = () => {
    Linking.openURL("mailto:yourfeedback@email.com?subject=App Feedback");
  };

  const handleReview = () => {
    Linking.openURL("https://yourappstorelink.com");
  };

  const handleDonate = (tier: (typeof DONATION_TIERS)[0]) => {
    Alert.alert(
      "Coming Soon!",
      `Donation feature will be available soon. Thank you for your interest in supporting the app!`
    );
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
        <Text style={styles.sectionTitle}>Donate</Text>
        <View style={styles.donateRow}>
          {DONATION_TIERS.map((tier) => (
            <TouchableOpacity
              key={tier.name}
              style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
              onPress={() => handleDonate(tier)}
            >
              <Text style={styles.donateTier}>{tier.name}</Text>
              <Text style={styles.donateAmount}>{tier.displayAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.donateMessage}>
          Give whatever feels right to support this app (no pole vault
          required!)
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
