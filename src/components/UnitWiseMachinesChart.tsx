// import React from "react";
// import { Dimensions, View } from "react-native";
// import { BarChart } from "react-native-gifted-charts";

// const { width } = Dimensions.get("window");

// export default function UnitWiseMachinesChart({ data }: { data: any[] }) {
//   const chartData = data.map((m) => ({
//     label: `M${m.machineNo}`,
//     value: m.workingEff, // y-axis → working efficiency
//     frontColor: "#2196F3",
//   }));

//   return (
//     <View style={{ alignItems: "center", marginTop: 20 }}>
//       <BarChart
//         data={chartData}
//         barWidth={18}
//         width={width * 0.95}
//         height={220}
//         yAxisSuffix="%"
//         noOfSections={6}
//         barBorderRadius={4}
//         isAnimated
//         animationDuration={800}
//         xAxisLabelTextStyle={{ fontSize: 10, rotate: 45 }}
//         yAxisTextStyle={{ fontSize: 10 }}
//       />
//     </View>
//   );
// }
