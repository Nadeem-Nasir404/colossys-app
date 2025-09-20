const BASE_URL = "http://192.168.1.101:801/api"; // ⚡ change to your backend

export async function loginApi(userName: string, password: string) {
  const response = await fetch(`${BASE_URL}/account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName,
      password,
    }),
  });

  const text = await response.text();
  console.log("🔑 Login API raw response:", text);

  if (!response.ok) throw new Error(text || "Failed to login");

  return JSON.parse(text);
}
