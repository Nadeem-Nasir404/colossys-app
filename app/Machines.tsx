import { AuthContext } from "@/src/contexts/AuthContexts";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { getUnitMachineGraph } from "@/src/api/UnitMachineGraphApi";
import { getUnitWiseGraph } from "@/src/api/UnitWiseApi";
import { getUnitWiseMachines } from "@/src/api/UnitWiseMachineApi";

import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import KpiUnitWise from "@/src/components/KpiUnitWise";
import MachineData from "@/src/components/MachineData";

export default function Machines() {
  const { userToken } = useContext(AuthContext);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const screenWidth = Dimensions.get("window").width - 40;

  // 🔹 Fetch Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnitWiseGraph(userToken!);
        setUnits(res);
        if (res.length > 0) setSelectedUnit(res[0].unit);
      } catch (err) {
        console.error("❌ Error fetching units:", err);
      }
    };
    fetchUnits();
  }, [userToken]);

  // 🔹 Fetch Machines when Unit changes
  useEffect(() => {
    if (!selectedUnit) return;
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const res = await getUnitWiseMachines(userToken!, selectedUnit);
        setMachines(res);
        if (res.length > 0) setSelectedMachine(res[0].machineNo.toString());
      } catch (err) {
        console.error("❌ Error fetching machines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [selectedUnit]);

  // 🔹 Fetch Graph data for selected Unit/Machine
  useEffect(() => {
    if (!selectedUnit || !selectedMachine) return;
    const fetchGraph = async () => {
      try {
        const res = await getUnitMachineGraph(userToken!, selectedUnit);
        setChartData(res);
      } catch (err) {
        console.error("❌ Error fetching graph data:", err);
      }
    };
    fetchGraph();
  }, [selectedUnit, selectedMachine]);

  const selectedData = machines.find(
    (m) => m.machineNo.toString() === selectedMachine
  );

  // 🔹 Prepare chart data
  const filteredData = chartData.filter(
    (i) => i.machineNo?.toString() === selectedMachine
  );

  const workingEffData = filteredData.map((i, idx) => ({
    value: i.workingEff,
    label: `Day ${idx + 1}`,
  }));

  const productionEffData = filteredData.map((i, idx) => ({
    value: i.prdEff,
    label: `Day ${idx + 1}`,
  }));

  return (
    <DashboardWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Select Unit */}
        <DashboardCard title="🏭 Select Unit">
          <Picker
            selectedValue={selectedUnit}
            onValueChange={(val) => setSelectedUnit(val)}
          >
            {units.map((u, idx) => (
              <Picker.Item key={idx} label={u.unit} value={u.unit} />
            ))}
          </Picker>
        </DashboardCard>

        {/* 🔹 Select Machine */}
        {machines.length > 0 && (
          <DashboardCard title="🛠 Select Machine">
            <Picker
              selectedValue={selectedMachine}
              onValueChange={(val) => setSelectedMachine(val)}
            >
              {machines.map((m, idx) => (
                <Picker.Item
                  key={idx}
                  label={`Machine ${m.machineNo}`}
                  value={m.machineNo.toString()}
                />
              ))}
            </Picker>
          </DashboardCard>
        )}

        {/* 🔹 Machine Data */}
        {loading ? (
          <DashboardCard>
            <ActivityIndicator size="large" color="#FF4A2C" />
          </DashboardCard>
        ) : (
          <MachineData machine={selectedData} />
        )}

        {/* 🔹 KPI Overview */}
        {selectedUnit && userToken && (
          <KpiUnitWise selectedUnit={selectedUnit} token={userToken} />
        )}

        {/* 🔹 7-Day Efficiency Chart */}
        {workingEffData.length > 0 && (
          <DashboardCard title="📊 Machine 7-Day Efficiency">
            <View
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: 12,
                paddingVertical: 20,
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                Performance Overview
              </Text>

              <LineChart
                data={workingEffData}
                data2={productionEffData}
                curved
                areaChart
                animateOnDataChange
                animationDuration={1200}
                showVerticalLines
                color1="#007bff"
                color2="#ff4d4d"
                startFillColor="rgba(0,123,255,0.35)"
                endFillColor="rgba(0,123,255,0.05)"
                startFillColor2="rgba(255,77,77,0.35)"
                endFillColor2="rgba(255,77,77,0.05)"
                height={280}
                width={screenWidth}
                initialSpacing={20}
                spacing={45}
                dataPointsColor1="#007bff"
                dataPointsColor2="#ff4d4d"
                dataPointsHeight={8}
                dataPointsWidth={8}
                hideDataPoints={false}
                showTextOnPress
                textShiftY={-15}
                textBackgroundColor="rgba(0,0,0,0.75)"
                textColor="#fff"
                textFontSize={11}
                textPadding={6}
                xAxisColor="#ccc"
                yAxisColor="#ccc"
                xAxisLabelTextStyle={{
                  fontSize: 11,
                  color: "#444",
                  fontWeight: "500",
                }}
                yAxisTextStyle={{
                  color: "#444",
                  fontSize: 11,
                  fontWeight: "500",
                }}
                showLegend
                legendText1="Working Efficiency"
                legendColor1="#007bff"
                legendText2="Production Efficiency"
                legendColor2="#ff4d4d"
                legendTextSize={13}
                yAxisLabelSuffix="%"
                rulesColor="#e5e7eb"
                rulesType="solid"
                noOfSections={6}
                backgroundColor="transparent"
              />

              <Text
                style={{
                  marginTop: 12,
                  color: "#666",
                  fontSize: 12,
                }}
              >
                Tap any point to see exact efficiency %
              </Text>
            </View>
          </DashboardCard>
        )}
      </ScrollView>
    </DashboardWrapper>
  );
}
