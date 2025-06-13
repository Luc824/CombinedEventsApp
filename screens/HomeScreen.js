import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combined Events Calculator</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Men:</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.rowButton]}
            onPress={() => navigation.navigate("Decathlon")}
          >
            <Text style={styles.buttonText}>Decathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rowButton]}
            onPress={() => navigation.navigate("MenHeptathlon")}
          >
            <Text style={styles.buttonText}>Heptathlon</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Women:</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.rowButton]}
            onPress={() => navigation.navigate("WomenHeptathlon")}
          >
            <Text style={styles.buttonText}>Heptathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rowButton]}
            onPress={() => navigation.navigate("WomenPentathlon")}
          >
            <Text style={styles.buttonText}>Pentathlon</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.rankingsButton]}
        onPress={() => navigation.navigate("Rankings")}
      >
        <Text style={styles.buttonText}>World Rankings Calculator</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  button: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  rowButton: {
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  rankingsButton: {
    backgroundColor: "#444",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
