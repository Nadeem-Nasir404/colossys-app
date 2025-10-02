import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { getUnitWiseGraph } from "@/src/api/UnitWiseApi";
import { getUnitWiseMachines } from "@/src/api/UnitWiseMachineApi";
import DashboardCard from "@/src/components/DashboardCard";
import DashboardWrapper from "@/src/components/DashboardWrapper";
import MachineData from "@/src/components/MachineData";
import { AuthContext } from "@/src/contexts/AuthContexts";

export default function Machines() {
  const { userToken } = useContext(AuthContext);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch units
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

  // Fetch machines when unit changes
  useEffect(() => {
    if (!selectedUnit) return;
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const res = await getUnitWiseMachines(userToken!, selectedUnit);
        setMachines(res);
        setSelectedMachine(null);
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
      {/* Unit Dropdown */}
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

      {/* Machine Dropdown */}
      {machines.length > 0 && (
        <DashboardCard title="🛠 Select Machine">
          <Picker
            selectedValue={selectedMachine}
            onValueChange={(val) => setSelectedMachine(val)}
          >
            <Picker.Item label="-- Select Machine --" value={null} />
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

      {/* Chart */}
      {loading ? (
        <DashboardCard>
          <ActivityIndicator size="large" color="#FF4A2C" />
        </DashboardCard>
      ) : (
        <MachineData machine={selectedData} />
      )}
    </DashboardWrapper>
  );
}
