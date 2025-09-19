import { AuthContext, AuthProvider } from "@/src/contexts/AuthContexts";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Redirect, Slot, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";

import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function CustomDrawerContent(props: any) {
  const { logout, user } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 👤 User Info Header */}
      <View
        style={{
          padding: 20,
          backgroundColor: "#FF4A2C",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
        <View>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {user?.name || "User"}
          </Text>
          <Text style={{ color: "#fff", fontSize: 13 }}>
            {user?.email || "abc@gmail.com"}
          </Text>
        </View>
      </View>

      {/* Default drawer items */}
      <DrawerItemList {...props} />

      {/* 🚪 Logout Button */}
      <TouchableOpacity
        style={{
          marginTop: "auto",
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={22} color="red" />
        <Text style={{ marginLeft: 10, fontSize: 16, color: "red" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// ✅ Guard: Protect Routes
function AuthGuard() {
  const { userToken, restoreSession } = useContext(AuthContext);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const publicRoutes = ["/login"];

  useEffect(() => {
    const init = async () => {
      console.log("🔄 Restoring session...");
      await restoreSession();
      setLoading(false);
    };
    init();
  }, [restoreSession]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FF4A2C" />
      </SafeAreaView>
    );
  }

  // ⛔ If no token → only allow login
  if (!userToken && !publicRoutes.includes(pathname)) {
    return <Redirect href="/login" />;
  }

  // ✅ If logged in but tries to access login → redirect home
  if (userToken && publicRoutes.includes(pathname)) {
    return <Redirect href="/" />;
  }

  // ✅ Show login screen without Drawer
  if (pathname === "/login") {
    return <Slot />;
  }

  // ✅ Drawer after login
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#FF4A2C" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#FF4A2C",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="unitwise"
        options={{
          title: "Unit Wise",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

// ✅ Root Layout
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
``;
