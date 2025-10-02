import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getKpiData from "@/src/api/KpiApi";
import { getTotalMachineGraph } from "@/src/api/TotalMachineApi";
import { getUnitMachineGraph } from "@/src/api/UnitMachineStatusApi";
import { getUnitWiseGraph } from "@/src/api/UnitWiseApi";

import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import KpiTable from "@/src/components/KpiTable";
import MachineStatusPie from "@/src/components/MachineStatusPie";
import UnitMachineChart from "@/src/components/UnitMachineChart";
import UnitWiseGraph from "@/src/components/UnitWiseGraph";
import UnitWiseTable from "@/src/components/UnitWiseTable";

import CustomText from "@/src/components/CustomText";
import { AuthContext } from "@/src/contexts/AuthContexts";

export default function Index() {
  const { userToken } = useContext(AuthContext);

  const [machineData, setMachineData] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [unitData, setUnitData] = useState<any>(null);
  const [unitWiseData, setUnitWiseData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const [machines, kpi, units, unitWise] = await Promise.all([
        getTotalMachineGraph(userToken),
        getKpiData(userToken),
        getUnitMachineGraph(userToken),
        getUnitWiseGraph(userToken), // 👈 fetch table data
      ]);

      console.log("✅ Machine API:", machines);
      console.log("✅ KPI API:", kpi);
      console.log("✅ Unit Machine API:", units);
      console.log("✅ Unit Wise API:", unitWise);

      setMachineData(machines);
      setKpiData(kpi);
      setUnitData(units);
      setUnitWiseData(unitWise);
    } catch (err: any) {
      setError(err.message || "Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userToken]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FF4A2C" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <CustomText style={{ fontWeight: "500", color: "red" }}>
          {error}
        </CustomText>
      </SafeAreaView>
    );
  }

  return (
    <DashboardWrapper>
      {/* Machine Status */}
      <DashboardCard>
        {machineData ? (
          <MachineStatusPie data={machineData} />
        ) : (
          <CustomText>No machine data found</CustomText>
        )}
      </DashboardCard>

      {/* Unit Wise Graph (Gifted Charts) */}
      <DashboardCard title="📊 Unit Wise Graph">
        {unitWiseData.length > 0 ? (
          <UnitWiseGraph data={unitWiseData} />
        ) : (
          <CustomText>No graph data found</CustomText>
        )}
      </DashboardCard>

      {/* Unit Wise Machine Chart */}
      <DashboardCard title="🏭 Unit Wise Machine Status">
        {unitData && unitData.length > 0 ? (
          <UnitMachineChart data={unitData} />
        ) : (
          <CustomText>No unit data found</CustomText>
        )}
      </DashboardCard>

      {/* KPI Overview */}
      <DashboardCard title="📈 KPI Overview">
        {kpiData ? (
          <KpiTable data={kpiData} />
        ) : (
          <CustomText>No KPI data found</CustomText>
        )}
      </DashboardCard>


      {/* Unit Wise Table */}
      <DashboardCard title="📋 Unit Wise Table">
        {unitWiseData.length > 0 ? (
          <UnitWiseTable data={unitWiseData} />
        ) : (
          <CustomText>No unit wise table data found</CustomText>
        )}
      </DashboardCard>
    </DashboardWrapper>
  );
}
