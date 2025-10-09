import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { getUnitWiseGraph } from "@/src/api/UnitWiseApi";
import { getUnitWiseMachines } from "@/src/api/UnitWiseMachineApi";
import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import KpiUnitWise from "@/src/components/KpiUnitWise"; // ✅ Import your existing component
import MachineData from "@/src/components/MachineData";
import { AuthContext } from "@/src/contexts/AuthContexts";

export default function Machines() {
  const { userToken } = useContext(AuthContext);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnitWiseGraph(userToken!);
        setUnits(res);
        if (res.length > 0) setSelectedUnit(res[0].unit);
      } catch (err) {
        console.error("❌ Error fetching units:", err);
      }
    };
    fetchUnits();
  }, [userToken]);

  // 🔹 Fetch Machines when Unit changes
  useEffect(() => {
    if (!selectedUnit) return;
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const res = await getUnitWiseMachines(userToken!, selectedUnit);
        setMachines(res);

        // ✅ Automatically select first machine
        if (res.length > 0) {
          setSelectedMachine(res[0].machineNo.toString());
        } else {
          setSelectedMachine(null);
        }
      } catch (err) {
        console.error("❌ Error fetching machines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [selectedUnit]);

  const selectedData = machines.find(
    (m) => m.machineNo.toString() === selectedMachine
  );

  return (
    <DashboardWrapper>
      {/* 🔹 Unit Dropdown */}
      <DashboardCard title="🏭 Select Unit">
        <Picker
          selectedValue={selectedUnit}
          onValueChange={(val) => setSelectedUnit(val)}
        >
          {units.map((u, idx) => (
            <Picker.Item key={idx} label={u.unit} value={u.unit} />
          ))}
        </Picker>
      </DashboardCard>

      {/* 🔹 Machine Dropdown */}
      {machines.length > 0 && (
        <DashboardCard title="🛠 Select Machine">
          <Picker
            selectedValue={selectedMachine}
            onValueChange={(val) => setSelectedMachine(val)}
          >
            {machines.map((m, idx) => (
              <Picker.Item
                key={idx}
                label={`Machine ${m.machineNo}`}
                value={m.machineNo.toString()}
              />
            ))}
          </Picker>
        </DashboardCard>
      )}

      {/* 🔹 Machine Data Chart */}
      {loading ? (
        <DashboardCard>
          <ActivityIndicator size="large" color="#FF4A2C" />
        </DashboardCard>
      ) : (
        <MachineData machine={selectedData} />
      )}

      {/* 🔹 KPI Overview for Selected Unit */}
      {selectedUnit && userToken && (
        <KpiUnitWise selectedUnit={selectedUnit} token={userToken} />
      )}
    </DashboardWrapper>
  );
}
