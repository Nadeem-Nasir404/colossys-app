const BASE_URL = "http://192.168.1.101:801/api"; // ✅ your backend

export async function getUnitWiseGraphApi(token: string) {
  const response = await fetch(`${BASE_URL}/ring/dashboard/unit-wise-graph`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();
  console.log("📊 UnitWiseGraph API raw response:", text);

  if (!response.ok) throw new Error(text || "Failed to fetch unit wise graph");

  return JSON.parse(text);
}
