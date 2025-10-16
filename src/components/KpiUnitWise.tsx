import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getUnitKPIData } from "../api/KpiUnitWise";

interface KpiUnitWiseProps {
  selectedUnit: string;
  token: string;
}

export default function KpiUnitWise({ selectedUnit, token }: KpiUnitWiseProps) {
  const [kpiData, setKpiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchKPI = async () => {
    try {
      setLoading(true);
      const res = await getUnitKPIData(token, selectedUnit);
      setKpiData(res[0]);
    } catch (error) {
      console.error("Failed to fetch KPI data:", error);
      setKpiData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPI();
  }, [selectedUnit]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!kpiData) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No KPI Data Available</Text>
      </View>
    );
  }

  // Transform KPI object to array for flatlist-style rendering
  const data = [
    { kpi: " Yarn Count", value: kpiData.yawnCount.toFixed(2) },
    { kpi: " Avg Speed", value: kpiData.avaregeSpeed.toFixed(2) },
    {
      kpi: " Working Efficiency",
      value: `${kpiData.workingEff.toFixed(2)}%`,
    },
    {
      kpi: " Production Efficiency",
      value: `${kpiData.productionEff.toFixed(2)}%`,
    },
    { kpi: " Avg TM", value: kpiData.avgtm.toFixed(2) },
    { kpi: " Avg TPI", value: kpiData.avgtpi.toFixed(2) },
  ];

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
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { alignItems: "center", marginTop: 20 },
  noData: { alignItems: "center", padding: 20 },
  noDataText: { fontSize: 16, color: "#888" },

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
});
