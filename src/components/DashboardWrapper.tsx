import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CustomText from "../components/CustomText";

interface WrapperProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardWrapper({ title, children }: WrapperProps) {
  // create one renderable item to safely enable scrolling
  const renderContent = () => (
    <View style={styles.content}>
      {title && <CustomText style={styles.title}>{title}</CustomText>}
      {children}
    </View>
  );

  return (
    <FlatList
      data={[1]} // dummy single item for safe scrolling
      renderItem={renderContent}
      keyExtractor={() => "dashboard-wrapper"}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF4A2C",
    marginBottom: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  content: {
    gap: 18,
  },
});
