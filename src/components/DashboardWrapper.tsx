import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../components/CustomText"; // ⬅️ adjust path if needed

interface WrapperProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardWrapper({ title, children }: WrapperProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {title && <CustomText style={styles.title}>{title}</CustomText>}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // clean light mode
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF4A2C", // brand orange for titles
    marginBottom: 18,
    fontFamily: "Poppins_600SemiBold", // ✅ ensures Poppins
  },
  content: {
    flex: 1,
    gap: 18,
    paddingBottom: 30, // safe bottom space
  },
});
