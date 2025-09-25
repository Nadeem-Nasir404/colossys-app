import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
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

        const formatted = data.map((unit: any) => {
          const workingEff = Number(unit.workingEff ?? 0);
          const productEff = Number(unit.prdEff ?? 0);
          const avgSpeed = Number(unit.avgSpeed ?? 0);

          return {
            label: (unit.unit ?? "Unknown").trim(),
            stacks: [
              {
                value: workingEff > 0 ? workingEff : 0.1,
                color: "#276FA9",
                label: `Working Eff: ${workingEff.toFixed(1)}%`,
                onPress: (x: number, y: number) =>
                  setTooltipData({
                    label: unit.unit,
                    metric: "Working Eff%",
                    value: workingEff.toFixed(1),
                    color: "#276FA9",
                    x,
                    y,
                  }),
              },
              {
                value: productEff > 0 ? productEff : 0.1,
                color: "#754961",
                label: `Product Eff: ${productEff.toFixed(1)}%`,
                onPress: (x: number, y: number) =>
                  setTooltipData({
                    label: unit.unit,
                    metric: "Product Eff%",
                    value: productEff.toFixed(1),
                    color: "#754961",
                    x,
                    y,
                  }),
              },
              {
                value: avgSpeed > 0 ? avgSpeed : 0.1,
                color: "#FF2F4F",
                label: `Avg Speed: ${avgSpeed.toFixed(1)}k`,
                onPress: (x: number, y: number) =>
                  setTooltipData({
                    label: unit.unit,
                    metric: "Avg Speed (1k)",
                    value: avgSpeed.toFixed(1),
                    color: "#FF2F4F",
                    x,
                    y,
                  }),
              },
            ],
          };
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
        color="#007bff"
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
      <View style={{ padding: 16 }}>
        <BarChart
          stackData={graphData}
          barWidth={30}
          spacing={25}
          barBorderRadius={6}
          noOfSections={5}
          yAxisThickness={1}
          xAxisThickness={1}
          isAnimated
          animationDuration={800}
          xAxisLabelTextStyle={{ fontSize: 12, color: "black" }}
          yAxisTextStyle={{ fontSize: 12, color: "black" }}
          showValuesAsTopLabel={false}
        />

        {/* Dynamic Tooltip */}
        {tooltipData && (
          <View
            style={{
              position: "absolute",
              left: tooltipData.x - 40, // adjust tooltip position horizontally
              top: tooltipData.y - 50, // adjust tooltip position above the bar
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
            { color: "#FF2F4F", label: "Avg Speed (1k)" },
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
    </Pressable>
  );
}
