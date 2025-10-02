import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface UnitData {
  unit: string;
  avgSpeed: number | null;
  workingEff: number;
  prdEff: number;
}

interface UnitWiseTableProps {
  data: UnitData[];
}

const UnitWiseTable: React.FC<UnitWiseTableProps> = ({ data }) => {
  const renderItem = ({ item, index }: { item: UnitData; index: number }) => (
    <View
      style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
    >
      <Text style={styles.cell}>{item.unit.trim()}</Text>
      <Text style={styles.cell}>
        {item.avgSpeed !== null ? item.avgSpeed.toFixed(2) : "-"}
      </Text>
      <Text
        style={[styles.cell, { color: item.workingEff < 0 ? "red" : "#333" }]}
      >
        {item.workingEff.toFixed(2)}%
      </Text>
      <Text style={styles.cell}>{item.prdEff.toFixed(2)}%</Text>
    </View>
  );

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.headerText}>Unit</Text>
        <Text style={styles.headerText}>Avg Speed</Text>
        <Text style={styles.headerText}>Working Eff (%)</Text>
        <Text style={styles.headerText}>Product Eff (%)</Text>
      </View>

      {/* Data Rows */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No data available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#343A40",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  rowEven: { backgroundColor: "#fdfdfd" }, // light zebra for card
  rowOdd: { backgroundColor: "#f7f7f7" },
  cell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  emptyText: {
    padding: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#999",
  },
});

export default UnitWiseTable;
