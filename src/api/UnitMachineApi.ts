// src/api/UnitMachineApi.ts
export const BASE_URL = "http://192.168.1.101:801/api";

export async function getUnitMachineGraph(token: string) {
  const res = await fetch(`${BASE_URL}/ring/dashboard/unit-machine-graph`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch unit machine graph");
  return res.json();
}
