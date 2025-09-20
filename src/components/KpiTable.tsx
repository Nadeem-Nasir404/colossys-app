import { KpiItem } from "@/src/api/KpiApi";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface KpiTableProps {
  data: KpiItem[];
}

const KpiTable: React.FC<KpiTableProps> = ({ data }) => {
  const renderItem = ({ item }: { item: KpiItem }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.kpi}</Text>
      <Text style={styles.cell}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cell}>KPI</Text>
        <Text style={styles.cell}>Value</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  table: { margin: 16 },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  header: { backgroundColor: "#f0f0f0" },
  cell: { flex: 1, textAlign: "center" },
});

export default KpiTable;
