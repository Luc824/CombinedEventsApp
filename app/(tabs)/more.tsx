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

export default function MoreScreen() {
  // Dummy handlers for now
  const handleFeedback = () => {
    // Replace with your feedback link or email
    Linking.openURL("mailto:yourfeedback@email.com?subject=App Feedback");
  };
  const handleReview = () => {
    // Replace with your app store review link
    Linking.openURL("https://yourappstorelink.com");
  };
  const handleDonate = (tier: string, amount: string) => {
    // Replace with your payment/donation link
    Alert.alert(
      `Thank you for choosing the ${tier} tier!`,
      `You selected to donate ${amount}€.`
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
          <TouchableOpacity
            style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
            onPress={() => handleDonate("Amateur", "0.99")}
          >
            <Text style={styles.donateTier}>Amateur</Text>
            <Text style={styles.donateAmount}>0.99€</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
            onPress={() => handleDonate("Pro", "2.99")}
          >
            <Text style={styles.donateTier}>Pro</Text>
            <Text style={styles.donateAmount}>2.99€</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.donateButton, { backgroundColor: TRACK_COLOR }]}
            onPress={() => handleDonate("GOAT", "9.99")}
          >
            <Text style={styles.donateTier}>GOAT</Text>
            <Text style={styles.donateAmount}>9.99€</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
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
