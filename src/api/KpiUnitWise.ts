export const BASE_URL = "http://192.168.1.101:801/api";

export async function getUnitMachineGraph(token: string, unit: string) {
  const res = await fetch(
    `${BASE_URL}/ring/dashboard/unit-machine-graph/${unit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch unit machine graph");
  return res.json();
}

export async function getUnitKPIData(token: string, unit: string) {
  const res = await fetch(`${BASE_URL}/ring/dashboard/kpi/${unit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch KPI data");
  return res.json();
}
