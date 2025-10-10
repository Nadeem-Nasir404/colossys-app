import { getUnitMachineGraph } from "@/src/api/UnitMachineGraphApi";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import CustomText from "./CustomText";
import DashboardCard from "./DashboardCard";

const screenWidth = Dimensions.get("window").width - 40;

interface Props {
  token: string;
  unit: string;
  machineNo: string;
}

export default function MachineEfficiencyChart({
  token,
  unit,
  machineNo,
}: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const res = await getUnitMachineGraph(token, unit);
        // ✅ Find data for selected machine only
        const machineData = res.find(
          (item: any) => item.machineNo.toString() === machineNo.toString()
        );

        if (machineData && machineData.last7Days) {
          setData(machineData.last7Days);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("❌ Error fetching machine graph:", err);
      } finally {
        setLoading(false);
      }
    };

    if (unit && machineNo) fetchGraph();
  }, [unit, machineNo]);

  if (loading) {
    return (
      <DashboardCard>
        <ActivityIndicator size="large" color="#FF4A2C" />
      </DashboardCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <DashboardCard>
        <CustomText>No efficiency data available for this machine.</CustomText>
      </DashboardCard>
    );
  }

  const labels = data.map((item: any) => item.date);
  const productEff = data.map((item: any) => item.productEfficiency);
  const workingEff = data.map((item: any) => item.workingEfficiency);

  return (
    <DashboardCard title="📊 7-Day Machine Efficiency">
      <View>
        {/* Product Efficiency Chart */}
        <CustomText style={{ marginBottom: 10 }}>Product Efficiency</CustomText>
        <LineChart
          data={{
            labels,
            datasets: [{ data: productEff }],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 74, 44, ${opacity})`,
            labelColor: () => "#000",
          }}
          bezier
          style={{ borderRadius: 10 }}
        />

        {/* Working Efficiency Chart */}
        <CustomText style={{ marginTop: 20, marginBottom: 10 }}>
          Working Efficiency
        </CustomText>
        <LineChart
          data={{
            labels,
            datasets: [{ data: workingEff }],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(44, 128, 255, ${opacity})`,
            labelColor: () => "#000",
          }}
          bezier
          style={{ borderRadius: 10 }}
        />
      </View>
    </DashboardCard>
  );
}
