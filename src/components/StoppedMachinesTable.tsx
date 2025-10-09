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
  unitName?: string; // optional — show unit title on card
}

export default function StoppedMachinesTable({ data, unitName }: Props) {
  if (!data || data.length === 0) {
    return (
      <DashboardCard
        title={`⛔ Stopped Machines ${unitName ? `(${unitName})` : ""}`}
      >
        <Text style={styles.noData}>No stopped machines found</Text>
      </DashboardCard>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: StoppedMachine;
    index: number;
  }) => (
    <View
      style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
    >
      <Text style={[styles.cell, styles.machine]}>
        {item.machineName || "-"}
      </Text>

      <Text
        style={[
          styles.cell,
          styles.status,
          item.mchRunStatus === "Stopped"
            ? styles.statusStopped
            : styles.statusRunning,
        ]}
      >
        {item.mchRunStatus || "-"}
      </Text>

      <Text
        style={[styles.cell, styles.reason]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.reason?.trim() || "-"}
      </Text>

      <Text style={[styles.cell, styles.time]}>
        {item.maxTime
          ? new Date(item.maxTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </Text>
    </View>
  );

  return (
    <DashboardCard
      title={`⛔ Stopped Machines ${unitName ? `(${unitName})` : ""}`}
    >
      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.headerText}>Machine</Text>
        <Text style={styles.headerText}>Status</Text>
        <Text style={styles.headerText}>Reason</Text>
        <Text style={styles.headerText}>Last Update</Text>
      </View>

      {/* Rows */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.machineNo.toString()}
        renderItem={renderItem}
      />
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#343A40",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  rowEven: {
    backgroundColor: "#fdfdfd",
  },
  rowOdd: {
    backgroundColor: "#f7f7f7",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12.5,
    color: "#222",
  },
  machine: {
    fontWeight: "600",
  },
  status: {
    fontWeight: "600",
  },
  statusStopped: {
    color: "#FF4A2C",
  },
  statusRunning: {
    color: "#0ABF04",
  },
  reason: {
    flex: 1.5,
  },
  time: {
    color: "#555",
    fontSize: 12,
  },
  noData: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    paddingVertical: 12,
  },
});
