import React from "react";
import { StyleSheet, View } from "react-native";
import CustomText from "../components/CustomText"; // ⬅️ adjust path if needed

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardCard({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      {title && <CustomText style={styles.cardTitle}>{title}</CustomText>}
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d5d4d4ff",

    borderRadius: 8,
    padding: 7,
    shadowColor: "#000",
    shadowOpacity: 0,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 13,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },
});
