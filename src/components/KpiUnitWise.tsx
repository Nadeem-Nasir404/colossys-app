import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📊 {selectedUnit} KPI Overview</Text>

      <View style={styles.grid}>
        <View style={styles.row}>
          <Text style={styles.label}>🧵 Yarn Count:</Text>
          <Text style={styles.value}>{kpiData.yawnCount.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>⚙️ Avg Speed:</Text>
          <Text style={styles.value}>{kpiData.avaregeSpeed.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>💪 Working Eff.:</Text>
          <Text style={styles.value}>{kpiData.workingEff.toFixed(2)}%</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🏭 Production Eff.:</Text>
          <Text style={styles.value}>{kpiData.productionEff.toFixed(2)}%</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>⏱️ Avg TM:</Text>
          <Text style={styles.value}>{kpiData.avgtm.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>📏 Avg TPI:</Text>
          <Text style={styles.value}>{kpiData.avgtpi.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { alignItems: "center", marginTop: 20 },
  noData: {
    alignItems: "center",
    padding: 20,
  },
  noDataText: { fontSize: 16, color: "#888" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  grid: { gap: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { fontSize: 15, color: "#444" },
  value: { fontSize: 15, fontWeight: "bold", color: "#007bff" },
});
