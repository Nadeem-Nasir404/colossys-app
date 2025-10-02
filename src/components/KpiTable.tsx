import { KpiItem } from "@/src/api/KpiApi";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface KpiTableProps {
  data: KpiItem[];
}

const KpiTable: React.FC<KpiTableProps> = ({ data }) => {
  const renderItem = ({ item, index }: { item: KpiItem; index: number }) => (
    <View
      style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
    >
      <Text style={styles.cellKey}>{item.kpi}</Text>
      <Text style={styles.cellValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.headerText}>📊 KPI</Text>
        <Text style={styles.headerText}>Value</Text>
      </View>

      {/* Rows */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No KPI data available</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#343A40", // brand orange for header
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  rowEven: { backgroundColor: "#fdfdfd" }, // softer to blend with card bg
  rowOdd: { backgroundColor: "#f7f7f7" },
  cellKey: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  cellValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  emptyText: {
    padding: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#999",
  },
});

export default KpiTable;
