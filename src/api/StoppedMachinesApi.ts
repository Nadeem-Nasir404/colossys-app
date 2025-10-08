// src/api/StoppedMachinesApi.ts
export const BASE_URL = "http://192.168.1.101:801/api";

export async function getStoppedMachines(token: string, unitName: string) {
  const cleanUnit = unitName.trim();

  const url = `${BASE_URL}/ring/dashboard/stopped/${encodeURIComponent(
    cleanUnit
  )}`;

  console.log("📡 Fetching stopped machines from:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  console.log("🔍 Raw stopped response:", text);

  if (!res.ok) {
    throw new Error(
      `❌ Failed to fetch stopped machines: ${res.status} - ${text}`
    );
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(
      "❌ JSON parse error in stopped machines:",
      text.substring(0, 200)
    );
    throw new Error("Invalid JSON from server for stopped machines");
  }
}
