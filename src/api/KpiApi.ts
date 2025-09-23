const BASE_URL = "http://192.168.1.101:801/api";

export type KpiItem = {
  kpi: string;
  value: number | string | null;
};

export default async function getKpiData(token: string): Promise<KpiItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/ring/dashboard/kpi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log("📊 KPI raw response:", text);

    if (!response.ok) throw new Error(text || response.statusText);

    const data = JSON.parse(text);

    // ✅ object → array convert
    const mapped: KpiItem[] = Object.entries(data).map(([key, value]) => ({
      kpi: key,
      value:
        typeof value === "number"
          ? value.toFixed(2)
          : typeof value === "string"
          ? value
          : value === null
          ? null
          : String(value),
    }));

    console.log("🔍 KPI API Response:", mapped);
    return mapped;
  } catch (err: any) {
    console.error("❌ KPI fetch error:", err.message);
    throw new Error(err.message || "Failed to fetch KPI data");
  }
}
