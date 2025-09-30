import React, { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

interface UnitData {
  unit: string;
  runningMch: number;
  stoppedMch: number;
}

export default function UnitMachineChart({ data }: { data: UnitData[] }) {
  const [tooltipData, setTooltipData] = useState<any>(null);

  const chartData = data.map((unit) => ({
    label: unit.unit.trim(),
    stacks: [
      {
        value: unit.runningMch,
        color: "#11574F", // Running (Green)
        onPress: (x: number, y: number) =>
          setTooltipData({
            label: unit.unit,
            metric: "Running",
            value: unit.runningMch,
            color: "#11574F",
            x,
            y,
          }),
      },
      {
        value: unit.stoppedMch,
        color: "#F44336", // Stopped (Red)
        onPress: (x: number, y: number) =>
          setTooltipData({
            label: unit.unit,
            metric: "Stopped",
            value: unit.stoppedMch,
            color: "#F44336",
            x,
            y,
          }),
      },
    ],
  }));

  return (
    <Pressable style={{ flex: 1 }} onPress={() => setTooltipData(null)}>
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
          showValuesAsTopLabel={false}
          showVerticalLines
        />

        {/* Dynamic Tooltip */}
        {tooltipData && (
          <View
            style={{
              position: "absolute",
              left: tooltipData.x - 40, // adjust horizontally
              top: tooltipData.y - 50, // above the bar
              backgroundColor: "#fff",
              padding: 8,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#ccc",
              zIndex: 10,
              width: 120,
            }}
          >
            <Text
              style={{
                color: tooltipData.color,
                fontWeight: "700",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {tooltipData.label}
            </Text>
            <Text
              style={{
                color: tooltipData.color,
                fontWeight: "600",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {tooltipData.metric}: {tooltipData.value}
            </Text>
          </View>
        )}

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
                backgroundColor: "#11574F",
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
    </Pressable>
  );
}
