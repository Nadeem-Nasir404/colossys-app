export const BASE_URL = "http://192.168.1.101:801/api";

export async function getUnitWiseMachines(token: string, unitName: string) {
  const cleanUnit = unitName.trim();

  // ✅ Correct URL format based on backend
  const url = `${BASE_URL}/ring/dashboard/Unit/${encodeURIComponent(
    cleanUnit
  )}`;
  console.log("📡 Fetching UnitWiseMachines URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  console.log("🔍 Raw Response:", text);

  if (!res.ok) {
    throw new Error(`Failed with status ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(
      "❌ JSON parse error. Response text was:",
      text.substring(0, 200)
    );
    throw new Error("Invalid JSON from server");
  }
}
