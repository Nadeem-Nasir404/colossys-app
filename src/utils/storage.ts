import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "authToken";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return (await AsyncStorage.getItem(TOKEN_KEY)) ?? null;
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
