import React from "react";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface MachineData {
  machineName: string;
  workingEff: number;
  prdEff: number;
  avgSpeed: number;
}

interface Props {
  data: MachineData[];
}

export default function MachineEfficiencyChart({ data }: Props) {
  // Convert your data into chart format
  const workingEffData = data.map((item) => ({
    value: item.workingEff,
    label: item.machineName,
  }));

  const prdEffData = data.map((item) => ({
    value: item.prdEff,
    label: item.machineName,
  }));

  return (
    <View style={{ padding: 10 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Machine Efficiency (Last 7 Days)
      </Text>

      <LineChart
        data={workingEffData}
        data2={prdEffData}
        curved
        areaChart
        showVerticalLines
        startFillColor="rgba(0,128,255,0.3)"
        endFillColor="rgba(0,128,255,0.05)"
        startOpacity={0.9}
        endOpacity={0.2}
        color1="#007bff"
        color2="#ff4d4d"
        textColor1="#333"
        height={250}
        spacing={60}
        initialSpacing={30}
        yAxisTextStyle={{ color: "#555" }}
        xAxisLabelTextStyle={{ color: "#555" }}
        hideRules={false}
        hideDataPoints={false}
        showTextOnPress
        showLegend
        legendThickness={4}
        legendColor1="#007bff"
        legendColor2="#ff4d4d"
        legendText1="Working Efficiency"
        legendText2="Production Efficiency"
      />
    </View>
  );
}
