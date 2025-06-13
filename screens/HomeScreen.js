import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";

const TRACK_COLOR = "#D35400";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <Text style={styles.title}>Combined Events{"\n"}Calculator</Text>
        <Text style={styles.sectionTitle}>Men</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.pillButton]}
            onPress={() => navigation.navigate("Decathlon")}
          >
            <Text style={styles.buttonText}>Decathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.pillButton]}
            onPress={() => navigation.navigate("MenHeptathlon")}
          >
            <Text style={styles.buttonText}>Heptathlon</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Women</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.pillButton]}
            onPress={() => navigation.navigate("WomenHeptathlon")}
          >
            <Text style={styles.buttonText}>Heptathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.pillButton]}
            onPress={() => navigation.navigate("WomenPentathlon")}
          >
            <Text style={styles.buttonText}>Pentathlon</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.rankingsButton]}
          onPress={() => navigation.navigate("Rankings")}
        >
          <Text style={styles.buttonText}>World Rankings Calculator</Text>
        </TouchableOpacity>
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
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  button: {
    backgroundColor: TRACK_COLOR,
    borderColor: "#fff",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  pillButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  rankingsButton: {
    borderRadius: 30,
    backgroundColor: TRACK_COLOR,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    alignSelf: "center",
  },
});
