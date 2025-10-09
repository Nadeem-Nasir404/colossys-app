import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getUnitWiseGraph } from "../api/UnitWiseApi";
import { AuthContext } from "../contexts/AuthContexts";

export default function UnitWiseGraph() {
  const { userToken } = useContext(AuthContext);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    async function fetchData() {
      if (!userToken) {
        setLoading(false);
        setGraphData([]);
        return;
      }

      try {
        const data = await getUnitWiseGraph(userToken);
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
                  workingEff,
                  productEff,
                  avgSpeed,
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
                  workingEff,
                  productEff,
                  avgSpeed,
                  x,
                  y,
                }),
            },
            {
              value: avgSpeed,
              label: "",
              frontColor: "#FF2F4F",
              spacing: 20,
              onPress: (x: number, y: number) =>
                setTooltipData({
                  label: unit.unit.trim(),
                  workingEff,
                  productEff,
                  avgSpeed,
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

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));

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
      {/* 🔍 Zoom Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 16,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          onPress={handleZoomOut}
          style={{
            backgroundColor: "#E0E0E0",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            marginRight: 6,
          }}
        >
          <Text style={{ fontWeight: "700" }}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleZoomIn}
          style={{
            backgroundColor: "#E0E0E0",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontWeight: "700" }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Chart with Zoom + Legend */}
      <ScrollView horizontal>
        <View
          style={{
            padding: 16,
            transform: [{ scale: zoom }],
            transformOrigin: "left top",
          }}
        >
          <BarChart
            data={graphData}
            barWidth={16}
            barBorderRadius={4}
            noOfSections={6}
            yAxisThickness={1}
            xAxisThickness={1}
            isAnimated
            animationDuration={700}
            xAxisLabelTextStyle={{
              fontSize: 10,
              color: "black",
              width: 40,
              textAlign: "center",
              flexWrap: "wrap",
            }}
            yAxisTextStyle={{ fontSize: 11, color: "black" }}
            adjustToFitXLabels
          />

          {/* 🎯 Tooltip */}
          {tooltipData && (
            <View
              style={{
                position: "absolute",
                left: tooltipData.x - 30,
                top: tooltipData.y - 70,
                backgroundColor: "#fff",
                padding: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ddd",
                zIndex: 10,
                width: 150,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 1, height: 2 },
                shadowRadius: 3,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 4,
                  color: "#333",
                }}
              >
                {tooltipData.label}
              </Text>

              <View style={{ gap: 4 }}>
                {[
                  {
                    color: "#276FA9",
                    label: "Working Eff%",
                    value: tooltipData.workingEff,
                  },
                  {
                    color: "#754961",
                    label: "Product Eff%",
                    value: tooltipData.productEff,
                  },
                  {
                    color: "#FF2F4F",
                    label: "Avg Speed",
                    value: tooltipData.avgSpeed,
                  },
                ].map((item, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: item.color,
                        marginRight: 6,
                        borderRadius: 2,
                      }}
                    />
                    <Text style={{ fontSize: 11, color: "#333" }}>
                      {item.label}:{" "}
                      <Text style={{ fontWeight: "600", color: item.color }}>
                        {item.value.toFixed(1)}
                      </Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 🟩 Legend (always visible below chart) */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 12,
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
                  marginHorizontal: 8,
                  marginVertical: 4,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    borderRadius: 2,
                    marginRight: 4,
                  }}
                />
                <Text style={{ fontSize: 12, color: "#333" }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Pressable>
  );
}
