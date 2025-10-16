import { KpiItem } from "@/src/api/KpiApi";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface KpiTableProps {
  data: KpiItem[];
}

const KpiTable: React.FC<KpiTableProps> = ({ data }) => {
  // ✅ Map your KPI keys to readable labels
  const labelMap: Record<string, string> = {
    yawnCount: "Yarn Count",
    avaregeSpeed: "Avg Speed",
    workingEff: "Working Efficiency",
    productionEff: "Production Efficiency",
    avgtm: "Avg TM",
    avgtpi: "Avg TPI",
  };

  // ✅ Clean and transform data from API
  const tableData = (Array.isArray(data) ? data : Object.entries(data || {}))
    .map((item: any, index: number) => {
      let key: string, value: any;

      if (Array.isArray(item)) {
        key = item[0];
        value = item[1];
      } else {
        key = item.kpi || `KPI-${index}`;
        value = item.value;
      }

      // Skip null or undefined values
      if (value === null || value === undefined || value === "") return null;

      // Fix "[object Object]" issue
      const cleanValue =
        typeof value === "object"
          ? JSON.stringify(value)
          : typeof value === "number"
          ? value.toFixed(2)
          : String(value ?? "N/A");

      const label = labelMap[key] || key;

      return { key, kpi: label, value: cleanValue };
    })
    .filter(Boolean); // ✅ Remove null entries

  const renderItem = ({ item, index }: any) => (
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
        data={tableData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No KPI data available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  rowEven: { backgroundColor: "#fdfdfd" },
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
