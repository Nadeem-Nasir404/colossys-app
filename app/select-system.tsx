import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectSystem() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const systems = [
    {
      id: 1,
      name: "RING-SYS",
      description: "Ring Spinning System",
      image: require("../assets/ring-sys.png"),
      action: () => router.replace("/"), // ✅ goes to dashboard
    },
    {
      id: 2,
      name: "AUTO-SYS",
      description: "Automation System",
      image: require("../assets/Auto-sys.png"),
    },
    {
      id: 3,
      name: "LOOM-SYS",
      description: "Weaving/Loom System",
      image: require("../assets/Loom-sys.png"),
    },
    {
      id: 4,
      name: "ELEC-SYS",
      description: "Electrical System",
      image: require("../assets/elect-sys.png"),
    },
  ];

  return (
    <>
      {/* ✅ Force full black area behind Android/iOS status bar */}
      <View
        style={{
          height:
            Platform.OS === "android" ? StatusBar.currentHeight : insets.top,
          backgroundColor: "#000",
        }}
      />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient colors={["#000000", "#343A40"]} style={styles.container}>
        <Text style={styles.header}>Select System</Text>

        <View style={styles.grid}>
          {systems.map((sys) => (
            <TouchableOpacity
              key={sys.id}
              style={[styles.card, !sys.action && { opacity: 0.5 }]}
              onPress={sys.action}
              activeOpacity={sys.action ? 0.7 : 1}
            >
              <Image
                source={sys.image}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.title}>{sys.name}</Text>
              <Text style={styles.desc}>{sys.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "700",
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  card: {
    width: "45%",
    backgroundColor: "#1f1f1f",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
    elevation: 6,
    shadowColor: "#FF4A2C",
    shadowOpacity: 0.2,
  },
  image: { width: 90, height: 90 },
  title: {
    color: "#FF4A2C",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  desc: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});
