import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

type MachineStatusProps = {
  data: {
    runningMch: number;
    stoppedMch: number;
    totalMch: number;
  };
};

export default function MachineStatusPie({ data }: MachineStatusProps) {
  const running = data.runningMch || 0;
  const stopped = data.stoppedMch || 0;
  const total = data.totalMch || running + stopped;

  const runningPercent = total > 0 ? ((running / total) * 100).toFixed(1) : "0";
  const stoppedPercent = total > 0 ? ((stopped / total) * 100).toFixed(1) : "0";

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const baseRadius = Math.min(width * 0.32, 140);

  const chartData = [
    {
      value: running,
      color: activeIndex === 0 ? "#2E7D32" : "#4CAF50",
      focused: activeIndex === 0,
      onPress: () => setActiveIndex(0), // ✅ tap handler
    },
    {
      value: stopped,
      color: activeIndex === 1 ? "#B71C1C" : "#F44336",
      focused: activeIndex === 1,
      onPress: () => setActiveIndex(1), // ✅ tap handler
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Total Machine Status</Text>

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
          <View style={styles.centerBox}>
            <Text style={styles.centerNumber}>{total}</Text>
            <Text style={styles.centerLabel}>Total</Text>
          </View>
        )}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: "#4CAF50" }]} />
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
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  centerBox: { alignItems: "center", justifyContent: "center" },
  centerNumber: { fontSize: 24, fontWeight: "bold", color: "#333" },
  centerLabel: { fontSize: 14, color: "#666" },
  legend: { marginTop: 20 },
  legendRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  legendText: { fontSize: 15, color: "#444", fontWeight: "500" },
});
