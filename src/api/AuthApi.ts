export const BASE_URL = "http://192.168.1.101:801"; // apna IP

export async function loginApi(userName: string, password: string) {
  const res = await fetch(`${BASE_URL}/account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName,
      password,
      email: "abc@gmail.com", // ✅ hardcoded email
    }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) throw new Error(data?.message || "Login failed");
  return data;
}
