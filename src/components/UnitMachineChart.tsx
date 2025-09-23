import React from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

interface UnitData {
  unit: string;
  runningMch: number;
  stoppedMch: number;
}

export default function UnitMachineChart({ data }: { data: UnitData[] }) {
  const chartData = data.map((unit) => ({
    label: unit.unit,
    stacks: [
      { value: unit.runningMch, color: "#2E7D32" }, // Running (Green)
      { value: unit.stoppedMch, color: "#F44336" }, // Stopped (Red)
    ],
  }));

  return (
    <View style={{ alignItems: "center", marginVertical: 30 }}>
      <BarChart
        width={width * 0.9}
        height={250}
        barWidth={28}
        barBorderRadius={6}
        stackData={chartData}
        noOfSections={5}
        spacing={30}
        isAnimated
        animationDuration={800}
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisTextStyle={{ fontSize: 12 }}
        xAxisLabelTextStyle={{ fontSize: 12 }}
        yAxisLabelWidth={30}
        showValuesAsTopLabel
        showVerticalLines
      />

      {/* Legend */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#2E7D32",
              marginRight: 6,
              borderRadius: 3,
            }}
          />
          <Text style={{ fontSize: 12 }}>Running</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#F44336",
              marginRight: 6,
              borderRadius: 3,
            }}
          />
          <Text style={{ fontSize: 12 }}>Stopped</Text>
        </View>
      </View>
    </View>
  );
}
