import KpiTable from "./components/KpiTable";

import getKpiData from "@/src/api/KpiApi";
import { AuthContext } from "@/src/contexts/AuthContexts";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { userToken, logout } = useContext(AuthContext);
  const [kpiData, setKpiData] = useState<any>(null); // 👈 null rakho, array nahi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const data = await getKpiData(userToken);
      console.log("🔍 KPI API Response:", data); // Debug log
      setKpiData(data || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch KPI data");
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
        <Text style={{ marginBottom: 10 }}>{error}</Text>
        <Button title="Retry" onPress={fetchData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            📊 KPI Dashboard
          </Text>
          {kpiData ? (
            <KpiTable data={kpiData} />
          ) : (
            <Text>No KPI data found</Text>
          )}
          {/* <Button title="Logout" onPress={logout} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
