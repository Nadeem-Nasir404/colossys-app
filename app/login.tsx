import { loginApi } from "@/src/api/AuthApi";
import { AuthContext } from "@/src/contexts/AuthContexts";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LoginResponse {
  token: string;
  [key: string]: any;
}

export default function Login(): JSX.Element {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async (): Promise<void> => {
    if (!userName || !password) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    setLoading(true);
    try {
      const data: LoginResponse = await loginApi(userName, password);
      console.log("✅ Login response:", data);

      const token = data?.token;
      if (!token) throw new Error("No token returned");

      await login(token, { userName });
      router.replace("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Check your credentials";
      console.error("❌ Login failed:", message);
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          style={[
            styles.input,
            focusedInput === "username" && styles.inputFocused,
          ]}
          onFocus={() => setFocusedInput("username")}
          onBlur={() => setFocusedInput(null)}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            focusedInput === "password" && styles.inputFocused,
          ]}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: {
    padding: 30,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  logo: { width: 270, height: 250, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#b8b8b8b7",
    width: "100%",
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#f9f9f950",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#FF4A2C",
  },
  button: {
    backgroundColor: "#FF4A2C",
    padding: 16,
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF4A2C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
