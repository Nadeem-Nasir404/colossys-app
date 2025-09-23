export const BASE_URL = "http://192.168.1.101:801/api";

export async function getUnitWiseGraph(token: string) {
  const res = await fetch(`${BASE_URL}/ring/dashboard/unit-wise-graph`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch unit machine graph");
  return res.json();
}
