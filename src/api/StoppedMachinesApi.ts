// src/api/StoppedMachinesApi.ts

export async function getStoppedMachines(token: string, unit: string) {
  try {
    // ensure spaces like "unit 6" are preserved properly
    const url = `http://192.168.1.101:801/api/ring/dashboard/stopped/unit ${encodeURIComponent(
      unit.trim()
    )}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed with status ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching stopped machines:", error);
    throw error;
  }
}
