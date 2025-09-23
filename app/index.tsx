import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getKpiData from "@/src/api/KpiApi";
import { getTotalMachineGraph } from "@/src/api/TotalMachineApi";
import { getUnitMachineGraph } from "@/src/api/UnitMachineApi";
import { getUnitWiseGraph } from "@/src/api/UnitWiseApi"; // 👈 new (table)

import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import KpiTable from "@/src/components/KpiTable";
import MachineStatusPie from "@/src/components/MachineStatusPie";
import UnitMachineChart from "@/src/components/UnitMachineChart";
import UnitWiseTable from "@/src/components/UnitWiseTable"; // 👈 new (table)

import { AuthContext } from "@/src/contexts/AuthContexts";

export default function Index() {
  const { userToken } = useContext(AuthContext);

  const [machineData, setMachineData] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [unitData, setUnitData] = useState<any>(null);
  const [unitWiseData, setUnitWiseData] = useState<any[]>([]); // 👈 table

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
        <Text>{error}</Text>
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
          <Text>No machine data found</Text>
        )}
      </DashboardCard>

      {/* Unit Wise Machine Chart */}
      <DashboardCard title="🏭 Unit Wise Machine Status">
        {unitData && unitData.length > 0 ? (
          <UnitMachineChart data={unitData} />
        ) : (
          <Text>No unit data found</Text>
        )}
      </DashboardCard>

      {/* KPI Overview */}
      <DashboardCard title="📈 KPI Overview">
        {kpiData ? <KpiTable data={kpiData} /> : <Text>No KPI data found</Text>}
      </DashboardCard>

      {/* Unit Wise Table */}
      <DashboardCard title="📋 Unit Wise Table">
        {unitWiseData.length > 0 ? (
          <UnitWiseTable data={unitWiseData} />
        ) : (
          <Text>No unit wise table data found</Text>
        )}
      </DashboardCard>
    </DashboardWrapper>
  );
}
