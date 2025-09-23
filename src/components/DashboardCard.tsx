import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardCard({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 10,
    textAlign: "center", // 👈 Added
  },
});
