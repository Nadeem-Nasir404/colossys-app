// src/api/UnitMachineGraphApi.ts
export const getUnitMachineGraph = async (
  token: string,
  unit: string
): Promise<any[]> => {
  try {
    const res = await fetch(
      `http://192.168.1.101:801/api/ring/dashboard/Unit/${unit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching unit machine graph:", error);
    return [];
  }
};
