import { AuthContext } from "@/src/contexts/AuthContexts";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getUnitMachineGraph } from "../api/UnitMachineStatusApi";
import CustomText from "./CustomText";

interface Props {
  unitName: string;
}

export default function UnitMachinePie({ unitName }: Props) {
  const { userToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(0);
  const [stopped, setStopped] = useState(0);

  useEffect(() => {
    if (!unitName) return;
    const fetchPieData = async () => {
      try {
        setLoading(true);
        const data = await getUnitMachineGraph(userToken!);
        const unitData = data.find(
          (item: any) => item.unit?.trim() === unitName?.trim()
        );
        if (unitData) {
          setRunning(unitData.runningMch || 0);
          setStopped(unitData.stoppedMch || 0);
        }
      } catch (err) {
        console.error("❌ Error loading pie chart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPieData();
  }, [unitName]);

  const chartData = [
    { value: running, color: "#4CAF50", text: `Running: ${running}` },
    { value: stopped, color: "#F44336", text: `Stopped: ${stopped}` },
  ];

  return (
    <View style={{ alignItems: "center", padding: 10 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF4A2C" />
      ) : (
        <>
          <PieChart
            data={chartData}
            radius={90}
            showText
            textColor="white"
            textSize={12}
            fontWeight="bold"
            donut
            innerRadius={50}
          />
          <CustomText
            style={{
              marginTop: 10,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {unitName} Machine Status
          </CustomText>
        </>
      )}
    </View>
  );
}
