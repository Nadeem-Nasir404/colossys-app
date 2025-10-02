// src/components/StoppedMachinesTable.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DashboardCard from "./DashboardCard";

interface StoppedMachine {
  machineNo: number;
  machineName: string;
  maxTime: string;
  mchRunStatus: string;
  reason: string;
}

interface Props {
  data: StoppedMachine[];
}

export default function StoppedMachinesTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <DashboardCard title="⛔ Stopped Machines">
        <Text style={styles.noData}>No stopped machines found</Text>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="⛔ Stopped Machines">
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>Machine</Text>
        <Text style={[styles.cell, styles.header]}>Status</Text>
        <Text style={[styles.cell, styles.header]}>Reason</Text>
        <Text style={[styles.cell, styles.header]}>Last Update</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.machineNo.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.machineName}</Text>
            <Text style={styles.cell}>{item.mchRunStatus}</Text>
            <Text style={styles.cell}>{item.reason.trim()}</Text>
            <Text style={styles.cell}>
              {new Date(item.maxTime).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: "#333",
  },
  header: {
    fontWeight: "700",
    color: "#FF4A2C",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
  },
});
