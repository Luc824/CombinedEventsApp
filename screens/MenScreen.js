import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function MenScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Men's Events</Text>
      <Text style={styles.subtitle}>Choose your event</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Decathlon")}
        >
          <Text style={styles.buttonText}>Decathlon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MenHeptathlon")}
        >
          <Text style={styles.buttonText}>Heptathlon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    color: "#2196F3",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
