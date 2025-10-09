import { AuthContext } from "@/src/contexts/AuthContexts";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getUnitMachineGraph } from "../api/UnitMachineStatusApi";

const { width } = Dimensions.get("window");

interface Props {
  unitName: string;
}

export default function UnitMachinePie({ unitName }: Props) {
  const { userToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(0);
  const [stopped, setStopped] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!unitName) return;
    const fetchPieData = async () => {
      try {
        setLoading(true);
        const data = await getUnitMachineGraph(userToken!);
        const unitData = data.find(
          (item: any) => item.unit?.trim() === unitName?.trim()
        );
        if (unitData) {
          setRunning(unitData.runningMch || 0);
          setStopped(unitData.stoppedMch || 0);
        }
      } catch (err) {
        console.error("❌ Error loading pie chart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPieData();
  }, [unitName]);

  const total = running + stopped;
  const runningPercent = total > 0 ? ((running / total) * 100).toFixed(1) : "0";
  const stoppedPercent = total > 0 ? ((stopped / total) * 100).toFixed(1) : "0";

  const baseRadius = Math.min(width * 0.32, 140);

  const chartData = [
    {
      value: running,
      color: activeIndex === 0 ? "#11574F" : "#107a57ff",
      focused: activeIndex === 0,
      onPress: () => setActiveIndex(0),
    },
    {
      value: stopped,
      color: activeIndex === 1 ? "#000000" : "#891616ff",
      focused: activeIndex === 1,
      onPress: () => setActiveIndex(1),
    },
  ];

  const getCenterLabel = () => {
    if (activeIndex === 0) {
      return (
        <>
          <Text style={[styles.centerNumber, { color: "#2E7D32" }]}>
            {running}
          </Text>
          <Text style={styles.centerLabel}>Running</Text>
        </>
      );
    }
    if (activeIndex === 1) {
      return (
        <>
          <Text style={[styles.centerNumber, { color: "#B71C1C" }]}>
            {stopped}
          </Text>
          <Text style={styles.centerLabel}>Stopped</Text>
        </>
      );
    }
    return (
      <>
        <Text style={styles.centerNumber}>{total}</Text>
        <Text style={styles.centerLabel}>Total</Text>
      </>
    );
  };

  return (
    <View style={{ alignItems: "center", paddingVertical: 15 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF4A2C" />
      ) : (
        <Pressable style={{ flex: 1 }} onPress={() => setActiveIndex(null)}>
          <View style={styles.container}>
            <PieChart
              data={chartData}
              donut
              radius={baseRadius}
              innerRadius={65}
              showText={false}
              isAnimated
              animationDuration={500}
              focusOnPress
              centerLabelComponent={() => (
                <View style={styles.centerBox}>{getCenterLabel()}</View>
              )}
            />

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: "#11574F" }]} />
                <Text style={styles.legendText}>
                  Running — {running} ({runningPercent}%)
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: "#F44336" }]} />
                <Text style={styles.legendText}>
                  Stopped — {stopped} ({stoppedPercent}%)
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  centerBox: { alignItems: "center", justifyContent: "center" },
  centerNumber: { fontSize: 20, fontWeight: "bold", color: "#333" },
  centerLabel: { fontSize: 14, color: "#666" },
  legend: { marginTop: 7 },
  legendRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  legendText: { fontSize: 15, color: "#444", fontWeight: "500" },
});
