import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getUnitWiseGraphApi } from "../api/UnitWiseGraphApi";
import { AuthContext } from "../contexts/AuthContexts";

export default function UnitWiseGraph() {
  const { userToken } = useContext(AuthContext);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!userToken) {
        setLoading(false);
        setGraphData([]);
        return;
      }

      try {
        const data = await getUnitWiseGraphApi(userToken);

        // Format: har unit ke 3 bars
        const formatted: any[] = [];
        data.forEach((unit: any) => {
          const workingEff = Number(unit.workingEff ?? 0);
          const productEff = Number(unit.prdEff ?? 0);
          const avgSpeed = Number(unit.avgSpeed ?? 0);

          formatted.push(
            {
              value: workingEff,
              label: unit.unit.trim(),
              frontColor: "#276FA9",
              spacing: 8,
              onPress: (x: number, y: number) =>
                setTooltipData({
                  label: unit.unit.trim(),
                  metric: "Working Eff%",
                  value: workingEff.toFixed(1),
                  color: "#276FA9",
                  x,
                  y,
                }),
            },
            {
              value: productEff,
              label: "",
              frontColor: "#754961",
              spacing: 8,
              onPress: (x: number, y: number) =>
                setTooltipData({
                  label: unit.unit.trim(),
                  metric: "Product Eff%",
                  value: productEff.toFixed(1),
                  color: "#754961",
                  x,
                  y,
                }),
            },
            {
              value: avgSpeed,
              label: "",
              frontColor: "#FF2F4F",
              spacing: 20, // group ke baad thoda zyada space
              onPress: (x: number, y: number) =>
                setTooltipData({
                  label: unit.unit.trim(),
                  metric: "Avg Speed",
                  value: avgSpeed.toFixed(1),
                  color: "#FF2F4F",
                  x,
                  y,
                }),
            }
          );
        });

        setGraphData(formatted);
      } catch (err: any) {
        console.error("❌ Error fetching graph:", err.message);
        setGraphData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userToken]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#FF4A2C"
        style={{ marginTop: 20 }}
      />
    );

  if (graphData.length === 0)
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No Data Available
      </Text>
    );

  return (
    <Pressable style={{ flex: 1 }} onPress={() => setTooltipData(null)}>
      <ScrollView horizontal>
        <View style={{ padding: 16 }}>
          <BarChart
            data={graphData}
            barWidth={14}
            barBorderRadius={4}
            noOfSections={6}
            yAxisThickness={1}
            xAxisThickness={1}
            isAnimated
            animationDuration={700}
            xAxisLabelTextStyle={{ fontSize: 9, color: "black" }}
            yAxisTextStyle={{ fontSize: 11, color: "black" }}
          />

          {/* Tooltip */}
          {tooltipData && (
            <View
              style={{
                position: "absolute",
                left: tooltipData.x - 40,
                top: tooltipData.y - 60,
                backgroundColor: "#fff",
                padding: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#ccc",
                zIndex: 10,
                width: 130,
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              { color: "#276FA9", label: "Working Eff%" },
              { color: "#754961", label: "Product Eff%" },
              { color: "#FF2F4F", label: "Avg Speed" },
            ].map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: item.color,
                    marginRight: 6,
                    borderRadius: 3,
                  }}
                />
                <Text style={{ fontSize: 12 }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Pressable>
  );
}
