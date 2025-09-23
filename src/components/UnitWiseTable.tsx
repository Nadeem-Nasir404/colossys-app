import React from "react";
import { FlatList, Text, View } from "react-native";

export default function UnitWiseTable({ data }: { data: any[] }) {
  return (
    <View style={{ marginTop: 10, marginBottom: 50 }}>
      {/* Header Row */}
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 8,
          borderBottomWidth: 2,
          borderColor: "#ccc",
          backgroundColor: "#f8f8f8",
        }}
      >
        <Text style={{ flex: 1, fontWeight: "bold" }}>Unit</Text>
        <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
          Running
        </Text>
        <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
          Stopped
        </Text>
        <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
          Total
        </Text>
      </View>

      {/* Data Rows */}
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ flex: 1 }}>{item.unit}</Text>
            <Text style={{ flex: 1, textAlign: "center", color: "green" }}>
              {item.runningMch}
            </Text>
            <Text style={{ flex: 1, textAlign: "center", color: "red" }}>
              {item.stoppedMch}
            </Text>
            <Text style={{ flex: 1, textAlign: "center" }}>
              {item.totalMch}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
