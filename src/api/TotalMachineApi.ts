export const BASE_URL = "http://192.168.1.101:801/api";

export async function getTotalMachineGraph(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/ring/dashboard/total-machine-graph`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("🔍 API Response Status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API Error Response:", errorText);
      throw new Error("Failed to fetch total machine status");
    }

    const json = await res.json();
    console.log("✅ Parsed JSON:", json);
    return json;
  } catch (error) {
    console.error("🚨 Fetch error:", error);
    throw error;
  }
}
