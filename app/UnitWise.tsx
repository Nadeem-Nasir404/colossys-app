import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { getUnitWiseGraph } from "@/src/api/UnitWiseApi";
import { getUnitWiseMachines } from "@/src/api/UnitWiseMachineApi";
import CustomText from "@/src/components/CustomText";
import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import { AuthContext } from "@/src/contexts/AuthContexts";

const { width } = Dimensions.get("window");

export default function UnitWise() {
  const { userToken } = useContext(AuthContext);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load all unit summary
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnitWiseGraph(userToken!);
        console.log("📊 UnitWiseGraph API raw response:", res);
        setUnits(res);
        if (res.length > 0) setSelectedUnit(res[0].unit.trim());
      } catch (err) {
        console.error("❌ Error fetching units:", err);
      }
    };
    fetchUnits();
  }, [userToken]);

  // 🔹 Load machines for selected unit
  useEffect(() => {
    if (!selectedUnit) return;
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const res = await getUnitWiseMachines(userToken!, selectedUnit);
        console.log("📡 Fetching machines for:", selectedUnit, res);
        setMachines(res);
      } catch (err) {
        console.error("❌ Error fetching unit wise machines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [selectedUnit]);

  // 🔹 Prepare chart data
  const chartData = machines.map((mch: any) => ({
    label: `M${mch.machineNo}`,
    stacks: [
      { value: mch.workingEff || 0, color: "#1976D2" }, // Blue
      { value: mch.prdEff || 0, color: "#6A1B9A" }, // Purple
      { value: mch.avgSpeed || 0, color: "#D32F2F" }, // Red
    ],
    machine: mch.machineNo,
    working: mch.workingEff,
    product: mch.prdEff,
    speed: mch.avgSpeed,
  }));

  return (
    <DashboardWrapper>
      {/* 🔹 Unit Selector Buttons */}
      <DashboardCard title="🏭 Select Unit">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {units.map((u, idx) => {
            const unitName = u.unit.trim();
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedUnit(unitName)}
                style={{
                  backgroundColor:
                    selectedUnit === unitName ? "#FF4A2C" : "#f1f1f1",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <CustomText
                  weight="medium"
                  style={{
                    color: selectedUnit === unitName ? "#fff" : "#333",
                    fontSize: 14,
                  }}
                >
                  {unitName}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </DashboardCard>

      {/* 🔹 Chart */}
      <DashboardCard title={`📊 Machine Status - ${selectedUnit || ""}`}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF4A2C" />
        ) : machines.length > 0 ? (
          <BarChart
            width={width * 0.95}
            height={260}
            barWidth={18} // smaller bars
            barBorderRadius={6}
            stackData={chartData}
            noOfSections={6}
            spacing={18}
            xAxisThickness={1}
            yAxisThickness={1}
            xAxisLabelTextStyle={{ fontSize: 11 }}
            yAxisTextStyle={{ fontSize: 11 }}
            showValuesAsTopLabel={false}
            isAnimated
            animationDuration={600}
            renderTooltip={(item: any) => (
              <View
                style={{
                  backgroundColor: "#333",
                  padding: 6,
                  borderRadius: 6,
                }}
              >
                <CustomText style={{ color: "#fff", fontSize: 12 }}>
                  M{item.machine}
                </CustomText>
                <CustomText style={{ color: "#90CAF9", fontSize: 11 }}>
                  Working: {item.working?.toFixed(1) || "0"}%
                </CustomText>
                <CustomText style={{ color: "#CE93D8", fontSize: 11 }}>
                  Product: {item.product?.toFixed(1) || "0"}%
                </CustomText>
                <CustomText style={{ color: "#EF9A9A", fontSize: 11 }}>
                  Speed: {item.speed?.toFixed(1) || "0"}
                </CustomText>
              </View>
            )}
          />
        ) : (
          <CustomText>No machine data found</CustomText>
        )}
      </DashboardCard>
    </DashboardWrapper>
  );
}
