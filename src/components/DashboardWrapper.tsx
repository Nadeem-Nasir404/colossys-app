import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface WrapperProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardWrapper({ title, children }: WrapperProps) {
  return (
    <ScrollView style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  content: {
    flex: 1,
    gap: 15,
  },
});
