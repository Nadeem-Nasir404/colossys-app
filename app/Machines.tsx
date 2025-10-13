import { AuthContext } from "@/src/contexts/AuthContexts";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
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
  const [tooltip, setTooltip] = useState<{
    day: string;
    work: number;
    prod: number;
  } | null>(null);

  const screenWidth = Dimensions.get("window").width - 60;

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

  // 🔹 Prepare API chart data
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

  // 🔹 Static Chart Data (for 14-Day Performance)
  const staticWorkingEff = [
    { value: 16, label: "Day 1" },
    { value: 18.2, label: "Day 2" },
    { value: 23.1, label: "Day 3" },
    { value: 27.9, label: "Day 4" },
    { value: 32.2, label: "Day 5" },
    { value: 36.4, label: "Day 6" },
    { value: 39.8, label: "Day 7" },
    { value: 38.4, label: "Day 8" },
    { value: 35.5, label: "Day 9" },
    { value: 29.2, label: "Day 10" },
    { value: 22, label: "Day 11" },
    { value: 17.8, label: "Day 12" },
    { value: 15.6, label: "Day 13" },
    { value: 12.4, label: "Day 14" },
  ];

  const staticProductionEff = [
    { value: -2.9, label: "Day 1" },
    { value: -3.6, label: "Day 2" },
    { value: -0.6, label: "Day 3" },
    { value: 4.8, label: "Day 4" },
    { value: 10.2, label: "Day 5" },
    { value: 14.5, label: "Day 6" },
    { value: 15.6, label: "Day 7" },
    { value: 16.5, label: "Day 8" },
    { value: 12, label: "Day 9" },
    { value: 6.5, label: "Day 10" },
    { value: 2, label: "Day 11" },
    { value: -0.9, label: "Day 12" },
    { value: -3.5, label: "Day 13" },
    { value: -5.2, label: "Day 14" },
  ];

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

        {/* 🔹 Static 14-Day Performance Chart */}
        <DashboardCard title="📈 14 Days Performance Overview">
          <View
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 16,
              paddingVertical: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: 10,
              }}
            >
              Machine {selectedMachine || ""} - 14 Days Trend
            </Text>

            <LineChart
              data={staticWorkingEff}
              data2={staticProductionEff}
              curved
              areaChart
              animateOnDataChange
              animationDuration={900}
              showVerticalLines
              color1="#94a3b8"
              color2="#ef4444"
              startFillColor="rgba(148,163,184,0.25)"
              endFillColor="rgba(148,163,184,0.05)"
              startFillColor2="rgba(239,68,68,0.3)"
              endFillColor2="rgba(239,68,68,0.05)"
              height={270}
              width={screenWidth}
              initialSpacing={25}
              spacing={40}
              dataPointsColor1="#94a3b8"
              dataPointsColor2="#ef4444"
              dataPointsHeight={8}
              dataPointsWidth={8}
              hideDataPoints={false}
              onDataPointClick={(item, index) => {
                setTooltip({
                  day: staticWorkingEff[index].label,
                  work: staticWorkingEff[index].value,
                  prod: staticProductionEff[index].value,
                });
              }}
              xAxisColor="#e5e7eb"
              yAxisColor="#e5e7eb"
              showLegend
              legendText1="Working Efficiency"
              legendColor1="#94a3b8"
              legendText2="Production Efficiency"
              legendColor2="#ef4444"
              legendTextSize={13}
              yAxisLabelSuffix="%"
              rulesColor="#e2e8f0"
              noOfSections={6}
            />

            <Text
              style={{
                marginTop: 12,
                color: "#64748b",
                fontSize: 12,
              }}
            >
              📊 Tap any point to see efficiency details
            </Text>
          </View>
        </DashboardCard>

        {/* 🔹 Tooltip Modal */}
        <Modal transparent visible={!!tooltip} animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
                width: "75%",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 6,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#222" }}>
                {tooltip?.day} Performance
              </Text>
              <Text style={{ marginTop: 8, color: "#475569" }}>
                🔹 Working Efficiency: {tooltip?.work}%
              </Text>
              <Text style={{ marginTop: 4, color: "#ef4444" }}>
                🔸 Production Efficiency: {tooltip?.prod}%
              </Text>

              <TouchableOpacity
                onPress={() => setTooltip(null)}
                style={{
                  marginTop: 15,
                  backgroundColor: "#007bff",
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </DashboardWrapper>
  );
}
