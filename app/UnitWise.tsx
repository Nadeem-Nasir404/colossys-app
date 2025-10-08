import { getStoppedMachines } from "@/src/api/StoppedMachinesApi";
import { getUnitWiseGraph } from "@/src/api/UnitWiseApi";
import { getUnitWiseMachines } from "@/src/api/UnitWiseMachineApi";
import CustomText from "@/src/components/CustomText";
import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import KpiUnitWise from "@/src/components/KpiUnitWise";
import StoppedMachinesTable from "@/src/components/StoppedMachinesTable";
import UnitMachinePie from "@/src/components/UnitMachinePie";
import { AuthContext } from "@/src/contexts/AuthContexts";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

export default function UnitWise() {
  const { userToken } = useContext(AuthContext);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tooltipData, setTooltipData] = useState<any>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);

  const [stoppedMachines, setStoppedMachines] = useState<any[]>([]);
  const [loadingStopped, setLoadingStopped] = useState(false);

  // 🔹 Load all units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnitWiseGraph(userToken!);
        if (Array.isArray(res) && res.length > 0) {
          setUnits(res);
          setSelectedUnit(res[0].unit.trim());
        } else {
          setUnits([]);
        }
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
        setMachines(Array.isArray(res) ? res : []);
        setPage(0);
      } catch (err) {
        console.error("❌ Error fetching machines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [selectedUnit]);

  // 🔹 Load stopped machines for selected unit
  useEffect(() => {
    if (!selectedUnit) return;
    const fetchStopped = async () => {
      setLoadingStopped(true);
      try {
        const res = await getStoppedMachines(userToken!, selectedUnit);
        setStoppedMachines(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("❌ Error fetching stopped machines:", err);
      } finally {
        setLoadingStopped(false);
      }
    };
    fetchStopped();
  }, [selectedUnit]);

  // 🔹 Pagination
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMachines = machines.slice(startIndex, endIndex);

  // 🔹 Chart Data
  const chartData: any[] = currentMachines.flatMap((mch: any) => {
    const working = mch.workingEff || 0;
    const product = mch.prdEff || 0;
    const speed = mch.avgSpeed || 0;

    return [
      {
        value: working,
        label: `M${mch.machineNo}`,
        frontColor: "#276FA9",
        spacing: 8,
        onPress: (x: number, y: number) =>
          setTooltipData({
            machine: mch.machineNo,
            metric: "Working Eff%",
            value: working.toFixed(1),
            color: "#276FA9",
            x,
            y,
          }),
      },
      {
        value: product,
        label: "",
        frontColor: "#754961",
        spacing: 8,
        onPress: (x: number, y: number) =>
          setTooltipData({
            machine: mch.machineNo,
            metric: "Product Eff%",
            value: product.toFixed(1),
            color: "#754961",
            x,
            y,
          }),
      },
      {
        value: speed,
        label: "",
        frontColor: "#FF2F4F",
        spacing: 20,
        onPress: (x: number, y: number) =>
          setTooltipData({
            machine: mch.machineNo,
            metric: "Avg Speed",
            value: speed.toFixed(1),
            color: "#FF2F4F",
            x,
            y,
          }),
      },
    ];
  });

  return (
    <DashboardWrapper>
      {/* 🔹 Unit Selector */}
      <DashboardCard title="🏭 Select Unit">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {units.map((u, idx) => {
            const unitName = u.unit.trim();
            const isSelected = selectedUnit === unitName;
            return (
              <Pressable
                key={idx}
                onPress={() => setSelectedUnit(unitName)}
                style={{
                  backgroundColor: isSelected ? "#FF4A2C" : "#f1f1f1",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <CustomText
                  weight="medium"
                  style={{
                    color: isSelected ? "#fff" : "#333",
                    fontSize: 14,
                  }}
                >
                  {unitName}
                </CustomText>
              </Pressable>
            );
          })}
        </ScrollView>
      </DashboardCard>

      {/* 🔹 Chart Section */}
      <DashboardCard title={`📊 All Machines Data - ${selectedUnit || ""}`}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF4A2C" />
        ) : currentMachines.length > 0 ? (
          <Pressable style={{ flex: 1 }} onPress={() => setTooltipData(null)}>
            <View style={{ padding: 10 }}>
              <BarChart
                data={chartData}
                width={width * 0.95}
                height={250}
                barWidth={14}
                barBorderRadius={4}
                noOfSections={6}
                yAxisThickness={1}
                xAxisThickness={1}
                isAnimated
                animationDuration={600}
                xAxisLabelTextStyle={{ fontSize: 10 }}
                yAxisTextStyle={{ fontSize: 10 }}
              />

              {/* 🔹 Pagination Controls */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                {/* Machines per page */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    width: 150,
                  }}
                >
                  <Picker
                    selectedValue={pageSize}
                    onValueChange={(val) => {
                      setPageSize(val);
                      setPage(0);
                    }}
                  >
                    {[1, 5, 8, 20, 50, 100].map((size) => (
                      <Picker.Item
                        key={size}
                        label={`${size} per page`}
                        value={size}
                      />
                    ))}
                  </Picker>
                </View>

                {/* Page dropdown */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    width: 150,
                  }}
                >
                  <Picker
                    selectedValue={page}
                    onValueChange={(val) => setPage(val)}
                  >
                    {Array.from(
                      { length: Math.ceil(machines.length / pageSize) },
                      (_, i) => i
                    ).map((pageIndex) => (
                      <Picker.Item
                        key={pageIndex}
                        label={`Page ${pageIndex + 1}`}
                        value={pageIndex}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Tooltip */}
              {tooltipData && (
                <View
                  style={{
                    position: "absolute",
                    left: tooltipData.x - 50,
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
                    Machine {tooltipData.machine}
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
            </View>
          </Pressable>
        ) : (
          <CustomText>No machine data found</CustomText>
        )}
      </DashboardCard>

      {/* 🔹 KPI Section */}
      {selectedUnit && (
        <DashboardCard title={`📈 ${selectedUnit} KPI Overview`}>
          <KpiUnitWise selectedUnit={selectedUnit} token={userToken!} />
        </DashboardCard>
      )}

      {/* 🔹 Pie Chart */}
      {selectedUnit && (
        <DashboardCard title={`⚙️ ${selectedUnit} Machine Status`}>
          <UnitMachinePie
            unitName={selectedUnit}
            running={
              units.find((u) => u.unit.trim() === selectedUnit)?.runningMch || 0
            }
            stopped={
              units.find((u) => u.unit.trim() === selectedUnit)?.stoppedMch || 0
            }
          />
        </DashboardCard>
      )}

      {/* 🔹 Stopped Machines Table */}
      <StoppedMachinesTable data={stoppedMachines} loading={loadingStopped} />
    </DashboardWrapper>
  );
}
