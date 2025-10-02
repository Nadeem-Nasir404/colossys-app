import React, { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import DashboardCard from "./DashboardCard";

const { width } = Dimensions.get("window");

interface MachineDataProps {
  machine: any; // 👈 will receive the selected machine object
}

export default function MachineData({ machine }: MachineDataProps) {
  const [tooltipData, setTooltipData] = useState<any>(null);

  if (!machine) {
    return (
      <DashboardCard title="📊 Machine Data">
        <Text>No machine data found</Text>
      </DashboardCard>
    );
  }

  const chartData = [
    {
      value: machine.workingEff || 0,
      label: "Working Eff%",
      frontColor: "#276FA9",
      onPress: (x: number, y: number) =>
        setTooltipData({
          metric: "Working Eff%",
          value: (machine.workingEff || 0).toFixed(1),
          color: "#276FA9",
          x,
          y,
        }),
    },
    {
      value: machine.prdEff || 0,
      label: "Product Eff%",
      frontColor: "#754961",
      onPress: (x: number, y: number) =>
        setTooltipData({
          metric: "Product Eff%",
          value: (machine.prdEff || 0).toFixed(1),
          color: "#754961",
          x,
          y,
        }),
    },
    {
      value: machine.avgSpeed || 0,
      label: "Avg Speed",
      frontColor: "#FF2F4F",
      onPress: (x: number, y: number) =>
        setTooltipData({
          metric: "Avg Speed",
          value: (machine.avgSpeed || 0).toFixed(1),
          color: "#FF2F4F",
          x,
          y,
        }),
    },
  ];

  return (
    <DashboardCard title="📊 Machine Data">
      <Pressable style={{ flex: 1 }} onPress={() => setTooltipData(null)}>
        <View style={{ padding: 10, alignItems: "center" }}>
          <BarChart
            data={chartData}
            width={width * 0.8}
            height={250}
            barWidth={45}
            barBorderRadius={6}
            noOfSections={6}
            yAxisThickness={1}
            xAxisThickness={1}
            isAnimated
            animationDuration={700}
            xAxisLabelTextStyle={{ fontSize: 12 }}
            yAxisTextStyle={{ fontSize: 10 }}
          />

          {/* Tooltip */}
          {tooltipData && (
            <View
              style={{
                position: "absolute",
                left: Math.max(10, tooltipData.x - 60),
                top: tooltipData.y - 70,
                backgroundColor: "#fff",
                padding: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#ccc",
                zIndex: 10,
                width: 140,
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
                {tooltipData.metric}
              </Text>
              <Text
                style={{
                  color: tooltipData.color,
                  fontWeight: "600",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {tooltipData.value}
              </Text>
            </View>
          )}

          {/* Legend */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              flexWrap: "wrap", // 👈 prevents legend overflow
            }}
          >
            {chartData.map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: item.frontColor,
                    marginRight: 6,
                    borderRadius: 3,
                  }}
                />
                <Text style={{ fontSize: 12 }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </DashboardCard>
  );
}
