// import React, { useState } from "react";
// import {
//   Modal,
//   Pressable,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import CustomText from "./CustomText";

// export default function UnitWiseMachinesTable({ data }: { data: any[] }) {
//   const [selectedRow, setSelectedRow] = useState<any | null>(null);

//   return (
//     <>
//       {/* Table */}
//       <ScrollView horizontal>
//         <View
//           style={{
//             flexDirection: "column",
//             borderWidth: 1,
//             borderColor: "#ddd",
//           }}
//         >
//           {/* Header Row */}
//           <View style={{ flexDirection: "row", backgroundColor: "#f1f1f1" }}>
//             <Text style={styles.header}>Machine</Text>
//             <Text style={styles.header}>Working Eff</Text>
//             <Text style={styles.header}>Prod Eff</Text>
//             <Text style={styles.header}>Avg Speed</Text>
//           </View>

//           {/* Data Rows */}
//           {data.map((row, index) => (
//             <TouchableOpacity
//               key={index}
//               style={{
//                 flexDirection: "row",
//                 borderBottomWidth: 1,
//                 borderColor: "#eee",
//                 paddingVertical: 6,
//               }}
//               onPress={() => setSelectedRow(row)} // 🔹 Open tooltip/modal
//             >
//               <Text style={styles.cell}>{row.machineNo}</Text>
//               <Text style={styles.cell}>
//                 {row.workingEff ? row.workingEff.toFixed(2) : "-"}%
//               </Text>
//               <Text style={styles.cell}>
//                 {row.prdEff ? row.prdEff.toFixed(2) : "-"}%
//               </Text>
//               <Text style={styles.cell}>
//                 {row.avgSpeed ? row.avgSpeed.toFixed(2) : "-"}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* 🔹 Tooltip Modal */}
//       <Modal
//         transparent
//         visible={!!selectedRow}
//         animationType="fade"
//         onRequestClose={() => setSelectedRow(null)}
//       >
//         <Pressable style={styles.overlay} onPress={() => setSelectedRow(null)}>
//           <View style={styles.tooltipBox}>
//             <CustomText weight="bold" style={{ fontSize: 16, marginBottom: 6 }}>
//               Machine {selectedRow?.machineNo}
//             </CustomText>
//             <CustomText style={{ color: "#1976D2", marginBottom: 4 }}>
//               Working Eff: {selectedRow?.workingEff?.toFixed(2) || "-"}%
//             </CustomText>
//             <CustomText style={{ color: "#6A1B9A", marginBottom: 4 }}>
//               Product Eff: {selectedRow?.prdEff?.toFixed(2) || "-"}%
//             </CustomText>
//             <CustomText style={{ color: "#D32F2F" }}>
//               Avg Speed: {selectedRow?.avgSpeed?.toFixed(2) || "-"}
//             </CustomText>
//           </View>
//         </Pressable>
//       </Modal>
//     </>
//   );
// }

// const styles = {
//   header: {
//     width: 110,
//     fontWeight: "bold",
//     textAlign: "center" as const,
//     padding: 8,
//   },
//   cell: {
//     width: 110,
//     textAlign: "center" as const,
//     padding: 6,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tooltipBox: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     elevation: 5,
//     minWidth: 200,
//     alignItems: "center",
//   },
// };
